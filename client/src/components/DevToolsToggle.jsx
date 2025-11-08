import { useEffect, useState } from 'react';

function DevToolsPanel() {
    const [erudaLoaded, setErudaLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/eruda';
        script.onload = () => {
            window.eruda.init();
            window.eruda.hide();
            setErudaLoaded(true);
        };
        document.body.appendChild(script);
    }, []);

    const toggleEruda = () => {
        if (window.eruda) {
            if (isVisible) {
                window.eruda.hide();
                setIsVisible(false);
            } else {
                window.eruda.show();
                setIsVisible(true);

                // Example: scale it smaller on small screens
                const erudaNode = document.querySelector('.eruda');
                if (erudaNode) {
                    erudaNode.style.transform = 'scale(0.8)';
                    erudaNode.style.transformOrigin = 'bottom right';
                }
            }
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
            
        </div>
    );
}

export default DevToolsPanel;
