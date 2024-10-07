import React from 'react';
import Link from 'next/link';

const Menu = () => {
    return (
        <div className="menu">
            <button className="menu-toggle">Open Menu</button>
            <div className="menu-content">
                {/* ... 其他链接 */}
                <Link href="/CurveTest">曲线测试</Link>
            </div>
        </div>
    );
};

export default Menu;