/**
 * Modified version of Christophe Choffel's Pointer class
 *
 * https://github.com/ULuIQ12/webgpu-tsl-linkedparticles/blob/main/src/lib/utils/Pointer.ts
 */
import { uniform } from 'three/tsl';
import { Camera, Plane, Raycaster, Vector2, Vector3, WebGPURenderer } from 'three/webgpu';

export class Pointer {
    constructor(renderer, camera, plane) {
        this.camera = camera;
        this.renderer = renderer;
        this.rayCaster = new Raycaster();
        this.initPlane = plane;
        this.iPlane = new Plane(new Vector3(0, 0, 1));
        this.clientPointer = new Vector2();
        this.pointer = new Vector2();
        this.scenePointer = new Vector3();
        this.pointerDown = false;
        this.uPointerDown = uniform(0);
        this.uPointer = uniform(new Vector3());

        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);

        this.iPlane = plane.clone();

        renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
        renderer.domElement.addEventListener('pointerup', this.onPointerUp);
        window.addEventListener('pointermove', this.onPointerMove);
    }

    onPointerDown(e) {
        if (e.pointerType !== 'mouse' || e.button === 0) {
            this.pointerDown = true;
            this.uPointerDown.value = 1;
        }

        this.clientPointer.set(e.clientX, e.clientY);
        this.updateScreenPointer(e);
    }

    onPointerUp(e) {
        this.clientPointer.set(e.clientX, e.clientY);
        this.updateScreenPointer(e);
        this.pointerDown = false;
        this.uPointerDown.value = 0;
    }

    onPointerMove(e) {
        this.clientPointer.set(e.clientX, e.clientY);
        this.updateScreenPointer(e);
    }

    updateScreenPointer(e) {
        if (e == null || e == undefined) {
            e = { clientX: this.clientPointer.x, clientY: this.clientPointer.y };
        }

        this.pointer.set(
            (e.clientX / this.renderer.domElement.offsetWidth) * 2 - 1,
            -(e.clientY / this.renderer.domElement.offsetHeight) * 2 + 1
        );
        this.rayCaster.setFromCamera(this.pointer, this.camera);
        this.rayCaster.ray.intersectPlane(this.iPlane, this.scenePointer);
        this.uPointer.value.x = this.scenePointer.x;
        this.uPointer.value.y = this.scenePointer.y;
        this.uPointer.value.z = this.scenePointer.z;
    }

    update() {
        this.iPlane.normal.copy(this.initPlane.normal).applyEuler(this.camera.rotation);
        this.updateScreenPointer();
    }

    destroy() {
        this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
        this.renderer.domElement.removeEventListener('pointerup', this.onPointerUp);
        window.removeEventListener('pointermove', this.onPointerMove);
    }
}