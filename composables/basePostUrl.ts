export const basePostUrl = async (path: any, formData: any) => {
    const { data } = await useFetch(() => `http://127.0.0.1:8000/${path}`, {
        method: 'POST',
        body: formData
    })
    return data;
}