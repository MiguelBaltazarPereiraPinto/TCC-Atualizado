//app.js

const root = document.getElementById('root');

function App() {
    const [view, setView] = React.useState('rooms');
    const [library, setLibrary] = React.useState(() => JSON.parse(localStorage.getItem('library')) || []);
    const [form, setForm] = React.useState({ title: '', type: '', discipline: '', link: '' });
    const [chatMessages, setChatMessages] = React.useState([]);
    const [chatInput, setChatInput] = React.useState('');

    React.useEffect(() => {
        localStorage.setItem('library', JSON.stringify(library));
    }, [library]);

    const addMaterial = (e) => {
        e.preventDefault();
        setLibrary([...library, form]);
        setForm({ title: '', type: '', discipline: '', link: ''});
    };

    const removeMaterial = (index) => {
        setLibrary(library.filter((_, i) => i !== index));
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        setChatMessages([...chatMessages, { text: chatInput, time: new Date().toLocaleTimeString() }]);
        setChatInput('');
    };

    return (
        React.createElement('div', { className: 'min-h-screen bg-gray-100 text-black'},
            React.createElement('header', { className: 'bg-red-700 text-white p-4 text-center text-2x1 font-bold'},
                'Maeutike - Mentoria Baseada em Dados, Lives e Leituras'
            ),

            React.createElement('nav', {className: 'flex justify-center space-x-4 p-4 bg-white shadow'},
                React.createElement('button', { className: '', onClick: () => setView('rooms') }, 'Salas'),
                React.createElement('button', { className: '', onClick: () => setView('library') }, 'Biblioteca')
            ),

            React.createElement('main', { className: 'p-4' },
                view === 'rooms' && React.createElement('div', null,
                    React.createElement('h2', { className: 'text-xl font-semibold mb-2' }, 'Salas por Disciplina'),
                    React.createElement('ul', { className: 'list-disc ml-5 mb-4' },
                        React.createElement('li', null, 'Programação'),
                        React.createElement('li', null, 'Banco de Dados'),
                        React.createElement('li', null, 'Redes')
                    ),
                    React.createElement('div', { className: 'bg-white p-4 rounded shadow' },
                        React.createElement('h3', { className: 'font-bold mb-2' }, 'Chat da Sala'),
                        React.createElement('div', { className: 'h-48 overflow-y-auto border p-2 mb-2 bg-gray-50' },
                            chatMessages.map((msg, i) => React.createElement('div', { key: i, className: 'mb-1' },
                                React.createElement('span', { className: 'text-gray-600 text-sm' }, `[${msg.time}]`), ` ${msg.text}`
                            ))
                        ),
                        React.createElement('form', { onSubmit: sendMessage, className: 'flex space-x-2' },
                            React.createElement('input', {
                                value: chatInput,
                                onChange: (e) => setChatInput(e.target.value),
                                placeholder: 'Digite sua mensagem...',
                                className: 'border p-1 flex-1'
                            }),
                            React.createElement('button', { className: 'bg-red-700 text-white px-4 py-1 rounded' }, 'Enviar')
                        )
                    )
                ),

                view === 'library' && React.createElement('div', null,
                    React.createElement('h2', { className: 'text-xl font-semibold mb-2' }, 'Biblioteca Digital'),
                    React.createElement('form', { onSubmit: addMaterial, className: 'space-y-2 mb-4' },
                        React.createElement('input', { value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }), placeholder: 'Título', className: 'border p-1 w-full' }),
                        React.createElement('input', { value: form.type, onChange: (e) => setForm({ ...form, type: e.target.value }), placeholder: 'Tipo (PDF/Vídeo)', className: 'border p-1 w-full' }),
                        React.createElement('input', { value: form.discipline, onChange: (e) => setForm({ ...form, discipline: e.target.value }), placeholder: 'Disciplina', className: 'border p-1 w-full' }),
                        React.createElement('input', { value: form.link, onChange: (e) => setForm({ ...form, link: e.target.value }), placeholder: 'Link (opcional)', className: 'border p-1 w-full' }),
                        React.createElement('button', { className: 'bg-red-700 text-white px-4 py-1 rounded' }, 'Adicionar')
                    ),
                    React.createElement('ul', null,
                        library.map((mat, i) => React.createElement('li', { key: i, className: 'flex justify-between border-b py-1' },
                            React.createElement('span', null, `${mat.title} — ${mat.type} — ${mat.discipline} `, mat.link && React.createElement('a', { href: mat.link, className: 'text-blue-500 ml-2', target: '_blank', rel: 'noreferrer' }, '[Acessar]')),
                            React.createElement('button', { onClick: () => removeMaterial(i), className: 'text-red-600' }, 'Remover')
                        ))
                    )
                ),

                React.createElement('footer', { className: 'mt-8 text-sm' },
                    React.createElement('p', null, 'Referências:'),
                    React.createElement('ul', { className: 'list-disc ml-5' },
                        React.createElement('li', null, React.createElement('a', { className: 'text-blue-500', href: 'https://nsa.cps.sp.gov.br', target: '_blank', rel: 'noreferrer' }, 'NSA ETEC')),
                        React.createElement('li', null, React.createElement('a', { className: 'text-blue-500', href: 'https://www.descomplica.com.br', target: '_blank', rel: 'noreferrer' }, 'Descomplica'))
                    )
                )
            )
        )
    );
}

// inicializa compatível com React 18 quando disponível
if (root) {
    if (window.ReactDOM && typeof ReactDOM.createRoot === 'function') {
        ReactDOM.createRoot(root).render(React.createElement(App));
    } else {
        ReactDOM.render(React.createElement(App), root);
    }
}
