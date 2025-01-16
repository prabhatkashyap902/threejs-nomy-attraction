import React, { useEffect, useRef } from 'react';
import Demo from './Demo.js'; // Ensure this path points to where you saved the provided code.

const WebGPUDemo = () => {
    const canvasRef = useRef(null); // Ref for the canvas element.
    const demoInstance = useRef(null); // Ref for the Demo class instance.

    useEffect(() => {
        // Initialize Demo when the component mounts
        if (canvasRef.current) {
            demoInstance.current = new Demo(canvasRef.current);
        }

        // Cleanup when the component unmounts
        return () => {
            demoInstance.current?.destroy();
            demoInstance.current = null;
        };
    }, []);

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            {/* Canvas for Three.js/WebGPU */}
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default WebGPUDemo;
