"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function useIsMounted() {
    const ref = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        ref.current = true;
        return () => {
            ref.current = false;
        };
    }, []);
    return (0, react_1.useCallback)(() => ref.current, [ref]);
}
exports.default = useIsMounted;
//# sourceMappingURL=isMounted.js.map