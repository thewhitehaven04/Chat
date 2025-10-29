export const useBoolean = (defaultValue = false) => {
    const val = ref(defaultValue)
    const toggle = () => {
        val.value = !val.value
    }

    return { val, toggle }
}
