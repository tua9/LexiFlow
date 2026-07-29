export async function translate(text: string): Promise<string> {
    if (!text?.trim()) return '';

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|vi`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data?.responseData?.translatedText ?? text;
    } catch (error) {
        console.error('Lỗi khi dịch:', error);
        return text;
    }
}
