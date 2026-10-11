import { MOUSE, Object3D, PerspectiveCamera, Quaternion, Scene, TOUCH, Vector3 } from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { ChemicalElement } from '../data/types';
import type { LayoutId, ResolvedQuality } from '../state/types';
import { QUALITY_PRESETS } from '../lib/quality';
import { computeLayout, LAYOUTS, type CameraPreset, type LabelPlacement, type Placement } from './layouts';
import { TweenGroup, easeInOutCubic } from './tween';

const FOV = 40;
/** Largura mínima (px na tela) de um cartão na tabela em telas pequenas. */
const MIN_CARD_PX = 44;

export interface EngineCallbacks {
  onCardActivate: (z: number) => void;
  onLabelActivate: (label: LabelPlacement) => void;
  /** Chamado a cada quadro renderizado (útil para posicionar tooltips). */
  onFrame?: () => void;
  /** Faixas do palco cobertas por controles (barra de modos no topo, legenda embaixo), em px. */
  getInsets?: () => { top: number; bottom: number };
}

interface CardEntry {
  el: ChemicalElement;
  host: HTMLDivElement;
  object: CSS3DObject;
}

interface LabelEntry {
  label: LabelPlacement;
  layout: LayoutId;
  host: HTMLDivElement;
  object: CSS3DObject;
}

const tmpQuat = new Quaternion();
const tmpObj = new Object3D();
const forward = new Vector3();
const toCamera = new Vector3();

function placementQuaternion(p: Placement): Quaternion {
  tmpObj.position.set(...p.position);
  tmpObj.rotation.set(0, 0, 0);
  if (p.lookAt) tmpObj.lookAt(new Vector3(...p.lookAt));
  return tmpQuat.copy(tmpObj.quaternion).clone();
}

/**
 * Motor imperativo da cena: cria um CSS3DObject por elemento (o conteúdo de
 * cada cartão é renderizado pelo React via portal) e anima as transições
 * entre as disposições espaciais.
 */
export class SceneEngine {
  readonly camera: PerspectiveCamera;
  readonly scene = new Scene();
  readonly renderer = new CSS3DRenderer();
  readonly controls: OrbitControls;
  readonly cards = new Map<number, CardEntry>();
  readonly labels = new Map<string, LabelEntry>();

  private tweens = new TweenGroup();
  private cameraTweens = new TweenGroup();
  private frame = 0;
  private needsRender = true;
  private layout: LayoutId = 'table';
  private quality: ResolvedQuality = 'high';
  private autoRotate = false;
  private disposed = false;
  private resizeObserver: ResizeObserver;
  private pointerDown: { x: number; y: number; z: number | null; label: string | null; time: number } | null = null;
  private lastInteraction = 0;

  constructor(
    private container: HTMLElement,
    elements: ChemicalElement[],
    private callbacks: EngineCallbacks,
  ) {
    const { clientWidth: w, clientHeight: h } = container;
    this.camera = new PerspectiveCamera(FOV, Math.max(w, 1) / Math.max(h, 1), 1, 30000);
    this.camera.position.set(0, 0, 3000);
    this.renderer.setSize(w, h);
    this.renderer.domElement.classList.add('scene-renderer');
    container.appendChild(this.renderer.domElement);

    for (const el of elements) {
      const host = document.createElement('div');
      host.className = 'card-host';
      host.dataset.z = String(el.z);
      const object = new CSS3DObject(host);
      // Posição inicial espalhada: os cartões "voam" para a tabela na abertura.
      object.position.set((Math.random() - 0.5) * 4000, (Math.random() - 0.5) * 4000, (Math.random() - 0.5) * 4000);
      this.scene.add(object);
      this.cards.set(el.z, { el, host, object });
    }

    for (const { id } of LAYOUTS) {
      for (const label of computeLayout(id, elements).labels) {
        const host = document.createElement('div');
        host.className = `label-host label-${label.kind} is-hidden`;
        host.dataset.label = label.id;
        const object = new CSS3DObject(host);
        object.position.set(...label.position);
        if (label.lookAt) object.lookAt(new Vector3(...label.lookAt));
        this.scene.add(object);
        this.labels.set(label.id, { label, layout: id, host, object });
      }
    }

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 250;
    this.controls.maxDistance = 9000;
    this.controls.screenSpacePanning = true;
    this.controls.zoomToCursor = true;
    this.controls.autoRotateSpeed = 0.6;
    this.controls.addEventListener('change', this.invalidate);
    this.controls.addEventListener('start', this.onControlStart);

    const dom = this.renderer.domElement;
    dom.addEventListener('pointerdown', this.onPointerDown, true);
    dom.addEventListener('pointerup', this.onPointerUp, true);
    container.addEventListener('scroll', this.resetScroll);
    dom.addEventListener('scroll', this.resetScroll);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.loop();
  }

  // -------------------------------------------------------------------------
  // Interação
  // -------------------------------------------------------------------------
  private invalidate = () => {
    this.needsRender = true;
  };

  private onControlStart = () => {
    this.lastInteraction = performance.now();
    this.cameraTweens.clear();
  };

  private resetScroll = (e: Event) => {
    const t = e.currentTarget as HTMLElement;
    if (t.scrollTop || t.scrollLeft) {
      t.scrollTop = 0;
      t.scrollLeft = 0;
    }
  };

  /**
   * O OrbitControls captura o ponteiro no pressionar, então o "click" não chega
   * ao cartão. Detectamos o toque/clique curto aqui, distinguindo de arrastes.
   */
  private onPointerDown = (e: PointerEvent) => {
    const target = e.target as HTMLElement;
    const card = target.closest<HTMLElement>('[data-z]');
    const label = target.closest<HTMLElement>('[data-label]');
    this.pointerDown = {
      x: e.clientX,
      y: e.clientY,
      z: card ? Number(card.dataset.z) : null,
      label: label?.dataset.label ?? null,
      time: performance.now(),
    };
  };

  private onPointerUp = (e: PointerEvent) => {
    const down = this.pointerDown;
    this.pointerDown = null;
    if (!down || e.button > 0) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    if (moved > 6 || performance.now() - down.time > 700) return;
    if (down.z !== null) this.callbacks.onCardActivate(down.z);
    else if (down.label) {
      const entry = this.labels.get(down.label);
      if (entry && entry.layout === this.layout) this.callbacks.onLabelActivate(entry.label);
    }
  };

  // -------------------------------------------------------------------------
  // Layouts e câmera
  // -------------------------------------------------------------------------
  /** Faixas cobertas pelos controles do palco, limitadas para não sumir com a cena. */
  private insets(): { top: number; bottom: number } {
    const h = this.container.clientHeight;
    const raw = this.callbacks.getInsets?.() ?? { top: 0, bottom: 0 };
    const top = Math.min(Math.max(raw.top, 0), h * 0.3);
    const bottom = Math.min(Math.max(raw.bottom, 0), h * 0.2);
    return { top, bottom };
  }

  /**
   * Distância da câmera para enquadrar uma área (largura × altura) na parte
   * livre do palco. Para formas com profundidade, soma-se o quanto elas
   * avançam em direção à câmera, para que os cartões da frente também caibam.
   */
  fitDistance(bounds: CameraPreset['bounds'], allowCropOnSmall: boolean): number {
    const { clientWidth: w, clientHeight: h } = this.container;
    const { top, bottom } = this.insets();
    const freeH = Math.max(h - top - bottom, 1);
    const tan = Math.tan(((FOV / 2) * Math.PI) / 180);
    // A altura visível no alvo é 2·d·tan; só a fração livre (freeH / h) pode ser usada.
    const byHeight = ((bounds.height / 2) * (h / freeH)) / tan;
    const byWidth = bounds.width / 2 / (tan * (Math.max(w, 1) / Math.max(h, 1)));
    let dist = Math.max(byHeight, byWidth) * 1.06 + (bounds.depth ?? 0);
    if (allowCropOnSmall) {
      // Em telas estreitas, não reduz os cartões a ponto de ficarem ilegíveis:
      // o usuário arrasta a tabela para ver o resto. A altura, porém, sempre cabe.
      const maxDist = ((h / 2) * 110) / (MIN_CARD_PX * tan);
      dist = Math.max(Math.min(dist, maxDist), Math.min(byHeight * 1.06, maxDist * 1.6));
    }
    return dist;
  }

  setLayout(id: LayoutId, opts: { animate?: boolean; resetCamera?: boolean } = {}) {
    const animate = opts.animate ?? true;
    this.layout = id;
    const result = computeLayout(id);
    const duration = QUALITY_PRESETS[this.quality].tweenMs;
    const now = performance.now();
    this.tweens.clear();

    for (const [z, entry] of this.cards) {
      const target = result.placements.get(z);
      if (!target) continue;
      const fromPos = entry.object.position.clone();
      const toPos = new Vector3(...target.position);
      const fromQuat = entry.object.quaternion.clone();
      const toQuat = placementQuaternion(target);
      if (!animate) {
        entry.object.position.copy(toPos);
        entry.object.quaternion.copy(toQuat);
        continue;
      }
      const d = duration * (0.55 + Math.random() * 0.45);
      this.tweens.add(
        {
          duration: d,
          delay: Math.random() * duration * 0.25,
          update: (k) => {
            entry.object.position.lerpVectors(fromPos, toPos, k);
            entry.object.quaternion.slerpQuaternions(fromQuat, toQuat, k);
          },
        },
        now,
      );
    }

    for (const entry of this.labels.values()) {
      entry.host.classList.toggle('is-hidden', entry.layout !== id);
    }

    this.applyControlScheme();
    if (opts.resetCamera ?? true) this.moveCamera(result.camera, animate ? duration * 1.05 : 0);
    this.needsRender = true;
  }

  private applyControlScheme() {
    const flat = this.layout === 'table' || this.layout === 'timeline';
    // Na tabela: arrastar move (pan) e o botão direito gira. Nos modos 3D: arrastar gira.
    this.controls.mouseButtons = flat
      ? { LEFT: MOUSE.PAN, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.ROTATE }
      : { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN };
    this.controls.touches = flat ? { ONE: TOUCH.PAN, TWO: TOUCH.DOLLY_ROTATE } : { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };
    this.controls.autoRotate = this.autoRotate && !flat;
  }

  moveCamera(preset: CameraPreset, duration: number) {
    const flat = this.layout === 'table' || this.layout === 'timeline' || this.layout === 'layers';
    const dist = this.fitDistance(preset.bounds, flat);
    const target = new Vector3(...preset.target);
    const dir = new Vector3(...preset.position).sub(target).normalize();
    const toPos = target.clone().add(dir.clone().multiplyScalar(dist));
    const { clientWidth: w, clientHeight: h } = this.container;
    const tan = Math.tan(((FOV / 2) * Math.PI) / 180);
    const worldPerPx = (2 * dist * tan) / Math.max(h, 1);
    // Centraliza o conteúdo na parte livre do palco (entre a barra de modos e a legenda):
    // desloca câmera e alvo juntos ao longo do "para cima" da tela.
    const { top, bottom } = this.insets();
    const up = new Vector3(0, 1, 0).sub(dir.clone().multiplyScalar(dir.y)).normalize();
    const lift = ((top - bottom) / 2) * worldPerPx;
    target.addScaledVector(up, lift);
    toPos.addScaledVector(up, lift);
    // Quando a tabela (ou a linha do tempo) não cabe na largura, começa pelo lado esquerdo
    // (grupo 1 / Antiguidade); o resto é visto arrastando.
    if (this.layout === 'table' || this.layout === 'timeline') {
      const halfVisibleW = (w / 2) * worldPerPx;
      const shift = Math.max(0, preset.bounds.width / 2 - halfVisibleW);
      target.x -= shift;
      toPos.x -= shift;
    }
    this.cameraTweens.clear();
    if (duration <= 0) {
      this.camera.position.copy(toPos);
      this.controls.target.copy(target);
      this.controls.update();
      this.needsRender = true;
      return;
    }
    const fromPos = this.camera.position.clone();
    const fromTarget = this.controls.target.clone();
    this.cameraTweens.add(
      {
        duration,
        delay: 0,
        update: (k) => {
          this.camera.position.lerpVectors(fromPos, toPos, k);
          this.controls.target.lerpVectors(fromTarget, target, k);
          this.camera.lookAt(this.controls.target);
        },
        done: () => this.controls.update(),
      },
      performance.now(),
    );
  }

  resetCamera() {
    this.moveCamera(computeLayout(this.layout).camera, 900);
  }

  /** Desloca a câmera (sem girar) para que o cartão fique visível. */
  ensureVisible(z: number) {
    const entry = this.cards.get(z);
    if (!entry) return;
    const p = entry.object.position.clone().project(this.camera);
    if (Math.abs(p.x) < 0.82 && Math.abs(p.y) < 0.78 && p.z < 1) return;
    const offset = this.camera.position.clone().sub(this.controls.target);
    const target = entry.object.position.clone();
    if (this.layout !== 'table' && this.layout !== 'timeline') return; // nos modos 3D o usuário gira livremente
    const fromPos = this.camera.position.clone();
    const fromTarget = this.controls.target.clone();
    const toPos = target.clone().add(offset);
    this.cameraTweens.clear();
    this.cameraTweens.add(
      {
        duration: 500,
        delay: 0,
        update: (k) => {
          this.camera.position.lerpVectors(fromPos, toPos, k);
          this.controls.target.lerpVectors(fromTarget, target, k);
        },
        done: () => this.controls.update(),
      },
      performance.now(),
    );
  }

  setQuality(q: ResolvedQuality) {
    this.quality = q;
    const preset = QUALITY_PRESETS[q];
    this.controls.enableDamping = preset.damping;
    this.container.dataset.quality = q;
    if (!preset.lighting) for (const c of this.cards.values()) c.host.style.removeProperty('--facing');
    this.needsRender = true;
  }

  setAutoRotate(on: boolean) {
    this.autoRotate = on;
    this.applyControlScheme();
    this.needsRender = true;
  }

  /** Coordenadas na tela (relativas ao contêiner) do centro de um cartão. */
  screenPosition(z: number): { x: number; y: number; visible: boolean } | null {
    const entry = this.cards.get(z);
    if (!entry) return null;
    const p = entry.object.getWorldPosition(new Vector3()).project(this.camera);
    const { clientWidth: w, clientHeight: h } = this.container;
    return { x: ((p.x + 1) / 2) * w, y: ((1 - p.y) / 2) * h, visible: p.z < 1 && Math.abs(p.x) <= 1.1 && Math.abs(p.y) <= 1.1 };
  }

  // -------------------------------------------------------------------------
  // Laço de renderização (renderiza só quando algo mudou)
  // -------------------------------------------------------------------------
  private resize() {
    const { clientWidth: w, clientHeight: h } = this.container;
    if (!w || !h) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.needsRender = true;
  }

  private updateLighting() {
    if (!QUALITY_PRESETS[this.quality].lighting) return;
    for (const { object, host } of this.cards.values()) {
      forward.set(0, 0, 1).applyQuaternion(object.quaternion);
      toCamera.copy(this.camera.position).sub(object.position).normalize();
      const facing = forward.dot(toCamera);
      host.style.setProperty('--facing', facing.toFixed(2));
    }
  }

  private loop = () => {
    if (this.disposed) return;
    this.frame = requestAnimationFrame(this.loop);
    const now = performance.now();
    const moving = this.tweens.tick(now);
    const cameraMoving = this.cameraTweens.tick(now, easeInOutCubic);
    // Pausa a rotação automática por alguns segundos após o usuário interagir.
    if (this.controls.autoRotate && now - this.lastInteraction < 4000) {
      this.controls.autoRotate = false;
      setTimeout(() => this.applyControlScheme(), 4100);
    }
    const controlsChanged = this.controls.enableDamping || this.controls.autoRotate ? this.controls.update() : false;
    if (moving || cameraMoving || controlsChanged || this.needsRender) {
      this.needsRender = false;
      this.updateLighting();
      this.renderer.render(this.scene, this.camera);
      this.callbacks.onFrame?.();
    }
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    this.controls.dispose();
    const dom = this.renderer.domElement;
    dom.removeEventListener('pointerdown', this.onPointerDown, true);
    dom.removeEventListener('pointerup', this.onPointerUp, true);
    this.container.removeEventListener('scroll', this.resetScroll);
    dom.remove();
  }
}
