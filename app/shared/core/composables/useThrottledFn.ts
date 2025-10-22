export const useThrottledFn = (fn: () => void, timeout_: number) => {
    let lastExecuted = 0

    return function execute() {
        const execTime = Date.now()

        if (execTime - lastExecuted > timeout_) {
            const res = fn()
            lastExecuted = execTime
            return res
        }
    }
}
