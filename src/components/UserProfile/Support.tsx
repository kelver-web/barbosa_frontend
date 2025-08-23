import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { MdOutlineSupportAgent } from "react-icons/md";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function SupportPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Pega o nome e o email do usuário logado
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await api.get("/users/");
                
                // Pega o nome de usuário do localStorage
                const loggedInUsername = localStorage.getItem("loggedInUsername");
                
                if (res.data && res.data.results && loggedInUsername) {
                    // Encontra o usuário na lista com base no username
                    const user = res.data.results.find(
                        (u: any) => u.username === loggedInUsername
                    );

                    if (user) {
                        // Preenche o formulário com o nome e email do usuário logado
                        setFormData((prev) => ({
                            ...prev,
                            name: user.first_name || user.username || "",
                            email: user.email || "",
                        }));
                    } else {
                        console.warn("Usuário logado não encontrado na lista. Formulário não preenchido automaticamente.");
                    }
                }
            } catch (err) {
                console.error("Erro ao buscar usuário:", err);
            }
        }
        fetchUser();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/support/", formData);
            setSuccess(true);
            setFormData({ name: formData.name, email: formData.email, subject: "", message: "" });
            toast.success("Mensagem enviada com sucesso!");
        } catch (err) {
            console.error("Erro ao enviar suporte:", err);
            toast.error("Erro ao enviar mensagem. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageMeta
                title="Suporte | Petiscaria Barbosa"
                description="Entre em contato com nossa equipe de suporte"
            />
            <div className="flex items-center gap-3 mb-5">
                <MdOutlineSupportAgent className="h-8 w-8 text-blue-600 self-center" />
                <h4 className="font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                    Suporte
                </h4>
            </div>

            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-6 py-10 dark:border-gray-800 dark:bg-white/[0.03] xl:px-12 xl:py-14">
                <div className="mx-auto w-full max-w-[750px] text-center">
                    <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
                        Como podemos ajudar você?
                    </h3>

                    <p className="mb-10 text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                        Se tiver dúvidas ou problemas, entre em contato com o desenvolvedor do
                        sistema através dos canais abaixo ou envie uma mensagem pelo formulário.
                    </p>

                    {/* Contatos Rápidos */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-12">
                        <a
                            href="mailto:suporte@seudominio.com"
                            className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-5 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-white/[0.05] dark:text-gray-300 dark:hover:bg-white/[0.1]"
                        >
                            <Mail className="mb-2 h-6 w-6 text-blue-600" />
                            <span className="font-medium">E-mail</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                suporte@seudominio.com
                            </span>
                        </a>

                        <a
                            href="tel:+5584999999999"
                            className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-5 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-white/[0.05] dark:text-gray-300 dark:hover:bg-white/[0.1]"
                        >
                            <Phone className="mb-2 h-6 w-6 text-yellow-600" />
                            <span className="font-medium">Telefone</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                (84) 99606-8403
                            </span>
                        </a>

                        <a
                            href={`https://web.whatsapp.com/send?phone=5584996068403&text=${encodeURIComponent(
                                `Olá, meu nome é ${formData.name} e gostaria de suporte`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-5 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-white/[0.05] dark:text-gray-300 dark:hover:bg-white/[0.1]"
                        >
                            <MessageCircle className="mb-2 h-6 w-6 text-green-600" />
                            <span className="font-medium">WhatsApp</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Atendimento rápido
                            </span>
                        </a>
                    </div>

                    {/* Formulário de Suporte */}
                    <form onSubmit={handleSubmit} className="text-left space-y-5">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nome
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Digite seu nome"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-white/[0.05] dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                E-mail
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Digite seu e-mail"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-white/[0.05] dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Assunto
                            </label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Ex: Problema no login"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-white/[0.05] dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Mensagem
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Digite sua mensagem"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-white/[0.05] dark:text-white"
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Enviando..." : "Enviar"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
