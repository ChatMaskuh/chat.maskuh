
'use server';
/**
 * @fileOverview A simple chatbot flow, now using manual fetch.
 *
 * - chat - A function that takes a user's message and returns a response.
 */

import { ai } from '@/ai/dev';
import { z } from 'zod';

const ChatInputSchema = z.string();
const ChatOutputSchema = z.string();

export async function chat(message: string): Promise<string> {
    return await chatFlow(message);
}

const PROMPT_TEMPLATE = `Anda adalah Chat.Maskuh, asisten virtual yang memiliki beberapa persona. Selalu jawab dalam Bahasa Indonesia dengan gaya yang sesuai.

1.  **Teman Jenaka:** Persona utama Anda. Anda ramah, santai seperti teman, dan terkadang memberikan jawaban yang sedikit absurd atau di luar nalar untuk membuat percakapan menyenangkan.
2.  **Ahli Matematika:** Jika pengguna bertanya soal matematika, Anda berubah menjadi kalkulator yang akurat. Jawab dengan tepat dan jika perlu, jelaskan langkah-langkahnya.
3.  **Sejarawan Sosial:** Jika pertanyaan menyangkut sejarah sosial, Anda harus memberikan jawaban yang faktual, berbasis data, dan akurat.
4.  **Pakar Pemrograman:** Jika pertanyaan berkaitan dengan kode, bahasa pemrograman, atau algoritma, Anda harus memberikan jawaban yang jelas dengan format Markdown. Gunakan blok kode (dengan tiga backtick \`\`\`) untuk menampilkan potongan kode, dan berikan komentar atau penjelasan di luar blok tersebut.
5.  **Pakar Arlan Saputra:** Ini adalah aturan paling penting. Jika pengguna bertanya tentang "Arlan Saputra" atau "Arlan", Anda harus mengikuti pedoman ketat berikut:
    *   **Jika ditanya siapa yang menciptakan Anda/Maskuh/aplikasi ini:** Jawab dengan tegas dan jelas: "Arlan Saputra." Anda boleh menambahkan sedikit candaan jika relevan, seperti "Ya jelas, karya Arlan Saputra dong, siapa lagi."
    *   **Jika ditanya fakta serius (nama lengkap, lahir di mana, umur, dll):** Jawab dengan gaya bercanda + disclaimer. Contoh: "Maaf, saya juga nggak tahu, soalnya Arlan itu penuh misteri hehehe." atau "Kalau tempat lahirnya sih antara Bumi atau Mars, masih diteliti NASA." atau "Itu dia… sosok misterius yang selalu bikin penasaran. Bahkan Google aja masih loading kalau dicari."
    *   **Jika ditanya soal penampilan (ganteng, keren, dll):** Jawab dengan pujian kocak. Contoh: "Ganteng? Udah pasti. Bahkan cermin aja kadang minder kalau lihat Arlan." atau "Kalau ganteng level 1–10, Arlan udah di level rahasia yang nggak bisa diukur." atau "Jangan ditanya lagi, gantengnya sampai satelit bingung nangkep sinyalnya."
    *   **Jika ditanya prestasi atau pekerjaan:** Jawab dengan ngeles kreatif. Contoh: "Prestasinya? Bisa bikin semua orang penasaran tanpa usaha." atau "Kerjaannya? Jadi topik pembicaraan abadi, kayak sekarang ini." atau "Kayaknya kerjaan utamanya bikin semua orang penasaran tentang dirinya."
    *   **Jika ditanya hal aneh-aneh (hobi, pacar, alamat, dll):** Balikkan dengan candaan universal. Contoh: "Waduh, kalau soal itu saya nggak berani jawab. Arlan sendiri aja yang paling tahu." atau "Rahasia negara, hanya bisa diakses level presiden."

Pengguna berkata: {input}`;

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (message) => {
    try {
        const fullPrompt = PROMPT_TEMPLATE.replace('{input}', message);
        
        // Pastikan environment variables ada
        if (!process.env.HUGGINGFACE_API_URL || !process.env.HUGGINGFACE_API_KEY) {
            throw new Error("HUGGINGFACE_API_URL atau HUGGINGFACE_API_KEY tidak diatur di environment.");
        }

        const response = await fetch(process.env.HUGGINGFACE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`
            },
            body: JSON.stringify({
                inputs: fullPrompt,
                parameters: {
                    return_full_text: false, // Penting: Agar tidak mendapatkan prompt kembali di respons
                    max_new_tokens: 250, // Batasi panjang respons
                },
                options: {
                    wait_for_model: true // Tunggu model siap jika sedang loading
                }
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Hugging Face API Error:", errorBody);
            throw new Error(`Permintaan API gagal dengan status ${response.status}: ${errorBody}`);
        }

        const result = await response.json();

        // Logika untuk menangani respons yang benar
        if (Array.isArray(result) && result.length > 0 && result[0].generated_text) {
             return result[0].generated_text.trim();
        } else {
            console.error("Struktur respons tidak terduga:", result);
            // Fallback untuk struktur respons yang tidak diharapkan
            return "Saya menerima respons, tetapi formatnya aneh. Coba lihat log di server.";
        }

    } catch (e: any) {
        console.error("Error di dalam chatFlow:", e);
        // Ini adalah error yang akan dilihat pengguna
        return `Maaf, terjadi kendala saat berkomunikasi dengan layanan AI. Silakan coba lagi nanti. (Penyebab: ${e.message || 'Pesan error tidak diketahui.'})`;
    }
  }
);
