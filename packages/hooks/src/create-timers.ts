import { createEffect, onCleanup, onMount, on, type Accessor } from 'solid-js';

/**
 * @description A hook for `setTimeout`
 * @param method The function inside the `setTimeout`
 * @param wait The wait time of `setTimeout`
 * @returns An array, the first element is the timer cleaner function, the second one is the timer self
 */
export const createTimeoutFn = (method: () => void, wait: number | Accessor<number>) => {
    let ready = false;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    function isReady() {
        return ready;
    }

    function clear() {
        ready = false;

        if (timeout) {
            clearTimeout(timeout);
        }
    }

    function timeoutSetter(waitTime: number) {
        clear();

        timeout = setTimeout(() => {
            ready = true;
            method();
        }, waitTime);

        onCleanup(clear);
    }

    function set() {
        const waitTime = typeof wait === 'function' ? wait() : wait;
        timeoutSetter(waitTime);
    }

    if (typeof wait === 'function') {
        createEffect(
            on(wait, waitTime => {
                timeoutSetter(waitTime);
            })
        );
    } else {
        onMount(set);
    }

    return [isReady, clear, set] as const;
};

/**
 * @description A hook for `setInterval`
 * @param method The function inside the `setInterval`
 * @param wait The wait time of `setInterval`
 * @returns An array, the first element is the timer cleaner function, the second one is the timer self
 */
export const createInterval = (method: () => void, wait: number | Accessor<number>) => {
    /** @description timer self */
    let timer: ReturnType<typeof setInterval> | null = null;

    /** @description clear function */
    const cleaner = () => {
        if (timer) {
            clearInterval(timer);
        }
    };

    const intervalSetter = (waitTime: number) => {
        timer = setInterval(method, waitTime);
        onCleanup(cleaner);
    };

    if (typeof wait === 'function') {
        createEffect(
            on(wait, waitTime => {
                intervalSetter(waitTime);
            })
        );
    } else {
        onMount(() => {
            intervalSetter(wait);
        });
    }

    return [cleaner, timer] as const;
};
