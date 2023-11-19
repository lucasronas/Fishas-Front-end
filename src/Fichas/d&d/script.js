        document.addEventListener('DOMContentLoaded', function () {
            allowOnlyOneSelection();
            const selects = document.querySelectorAll('select');
            let selectedValues = {};

            selects.forEach((select) => {
                select.addEventListener('change', function () {
                    const selectedOption = this.options[this.selectedIndex];
                    const selectedValue = selectedOption.value;

                    // Verifique se o valor já foi selecionado em outro atributo
                    if (selectedValues[selectedValue] > 1) {
                        alert('Este valor já foi selecionado em outro atributo. Escolha outro valor.');
                        this.selectedIndex = 0;
                    } else {
                        selectedValues[selectedValue] = (selectedValues[selectedValue] || 0) + 1;
                    }
                });
            });
        });

        const limitePericias = {
            Bárbaro: 2,
            Bardo: 3,
            Bruxo: 2,
            Clérigo: 2,
            Druida: 2,
            Feiticeiro: 2,
            Guerreiro: 2,
            Ladino: 4,
            Mago: 2,
            Paladino: 2,
            Patrulheiro: 3,
            Monge: 2
        };
        
        // Função para habilitar ou desabilitar as opções de sub-raça com base na raça selecionada
        document.getElementById('racaPersonagem').addEventListener('change', function() {
            const subRacaSelect = document.getElementById('subRacaPersonagem');
            const racaSelecionada = this.value;
            
            // Mapeamento de raças para sub-raças
            const subRacas = {
                'Anão': ['Anão da Colina', 'Anão da Montanha'],
                'Elfo': ['Alto Elfo', 'Elfo da Floresta', 'Elfo Negro (Drow)'],
                'Meio-Elfo': ['Não tem sub-raça'],
                'Halfling': ['Pés Leves', 'Robusto'],
                'Humanos': ['Não tem sub-raça'],
                'Draconato': ['Não tem sub-raça'],
                'Gnomo': ['Gnomo da Floresta', 'Gnomo das Rochas'],
                'Meio-Orc': ['Não tem sub-raça'],
                'Tieflings': ['Infernal', 'Abissal']
            };
            
            // Habilitar ou desabilitar o campo de seleção da sub-raça
            if (racaSelecionada in subRacas) {
                const subRacasDaRaca = subRacas[racaSelecionada];
                subRacaSelect.innerHTML = ''; // Limpar opções existentes
                
                if (subRacasDaRaca.length === 0) {
                    subRacaSelect.disabled = true;
                } else {
                    subRacaSelect.disabled = false;
                    subRacasDaRaca.forEach(function(subRaca) {
                        const option = document.createElement('option');
                        option.value = subRaca;
                        option.textContent = subRaca;
                        subRacaSelect.appendChild(option);
                    });
                }
            } else {
                subRacaSelect.innerHTML = '<option value="">Selecione uma raça primeiro</option>';
                subRacaSelect.disabled = true;
            }
        });

        // Função para habilitar ou desabilitar as opções de arquétipo de classe com base na classe selecionada
        document.getElementById('classePersonagem').addEventListener('change', function() {
            const arquetipoSelect = document.getElementById('arquetipoClasse');
            const classeSelecionada = this.value;
            
            // Mapeamento de classes para arquétipos
            const arquetipos = {
                'Bruxo': ['Arquifada', 'Corruptor', 'Grande Antigo'],
                'Clérigo': ['Conhecimento', 'Enganação', 'Guerra', 'Luz', 'Natureza', 'Tempestade', 'Vida'],
                'Feiticeiro': ['Linhagem Dracônica', 'Magia Selvagem']
            };
            
            // Habilitar ou desabilitar o campo de seleção do arquétipo de classe
            if (classeSelecionada in arquetipos) {
                const arquetiposDaClasse = arquetipos[classeSelecionada];
                arquetipoSelect.innerHTML = ''; // Limpar opções existentes
                
                if (arquetiposDaClasse.length === 0) {
                    arquetipoSelect.disabled = true;
                } else {
                    arquetipoSelect.disabled = false;
                    arquetiposDaClasse.forEach(function(arquetipo) {
                        const option = document.createElement('option');
                        option.value = arquetipo;
                        option.textContent = arquetipo;
                        arquetipoSelect.appendChild(option);
                    });
                }
            } else {
                arquetipoSelect.innerHTML = '<option value="">Selecione uma classe primeiro</option>';
                arquetipoSelect.disabled = true;
            }

            // Função para atualizar as habilidades (perícias) com base na classe selecionada
            function updateSkills() {
                // Obtém a classe selecionada do elemento com ID 'classePersonagem'
                const selectedClass = document.getElementById('classePersonagem').value;
                
                // Obtém o contêiner de habilidades com ID 'periciasContainer'
                const skillsContainer = document.getElementById('periciasContainer');
                
                // Obtém o limite de habilidades para a classe selecionada, ou 0 se não estiver definido
                const skillsLimit = limitePericias[selectedClass] || 0;
                
                // Obtém a lista de habilidades disponíveis para a classe selecionada, ou uma lista vazia se não estiver definida
                const availableSkills = periciasclasses[selectedClass] || [];

                // Limpa as habilidades existentes no contêiner
                skillsContainer.innerHTML = '';

                // Cria checkboxes para cada habilidade disponível
                availableSkills.forEach(skill => {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = 'pericia';
                    checkbox.value = skill;
                    checkbox.id = skill.toLowerCase().replace(/ /g, ''); // Remove espaços e torna minúsculo para IDs únicos

                    const label = document.createElement('label');
                    label.htmlFor = checkbox.id;
                    label.appendChild(document.createTextNode(skill));

                    // Adiciona checkbox, label e uma quebra de linha ao contêiner de habilidades
                    skillsContainer.appendChild(checkbox);
                    skillsContainer.appendChild(label);
                    skillsContainer.appendChild(document.createElement('br'));
                });

                // Adiciona um contador para o número de habilidades selecionadas
                const skillsCounter = document.createElement('p');
                skillsCounter.innerHTML = `Perícias selecionadas: <span id="contador">0</span>/${skillsLimit}`;
                skillsContainer.appendChild(skillsCounter);

                // Adiciona ouvintes de eventos para a seleção de habilidades
                const checkboxes = document.querySelectorAll('input[name="pericia"]');
                checkboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', () => updateSkillsCounter(skillsCounter, checkboxes, skillsLimit));
                });
            }

            // Função para atualizar o contador de habilidades
            function updateSkillsCounter(counterElement, checkboxes, limit) {
                // Obtém o número de habilidades selecionadas
                const selectedSkills = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
                
                // Atualiza o conteúdo do contador com o número de habilidades selecionadas
                counterElement.innerHTML = `Perícias selecionadas: <span id="contador">${selectedSkills}</span>/${limit}`;

                // Desabilita/ativa checkboxes com base no limite
                checkboxes.forEach(checkbox => {
                    checkbox.disabled = selectedSkills >= limit && !checkbox.checked;
                });
            }

            // Aciona a função updateSkills para configurar o estado inicial
            updateSkills();

        });

        function updateOptions(changedSelect) {
            const selects = document.querySelectorAll('.attribute-select');

            selects.forEach(select => {
                if (select !== changedSelect) {
                    for (let i = 0; i < select.options.length; i++) {
                        select.options[i].disabled = false;
                    }
                }
            });

            const selectedValues = Array.from(selects, s => s.value);
            selects.forEach(select => {
                select.querySelectorAll('option').forEach(option => {
                    if (selectedValues.filter(value => value === option.value).length > 0) {
                        option.disabled = true;
                    }
                });
            });
        }

        // Adicione um evento de clique para manipular a seleção de perícias
        document.getElementById('periciasContainer').addEventListener('click', function (event) {
            const checkbox = event.target;
            const isChecked = checkbox.checked;

            // Lógica para permitir mais de uma perícia
            // (Adicione ou remova a perícia selecionada da lista)
            if (isChecked) {
                // Adicione a perícia à lista (você pode armazenar em um array, por exemplo)
                console.log(`Perícia adicionada: ${checkbox.id}`);
            } else {
                // Remova a perícia da lista
                console.log(`Perícia removida: ${checkbox.id}`);
            }
        });

        // Função para habilitar ou desabilitar as opções de antecedente de classe com base na classe selecionada
        document.getElementById('classePersonagem').addEventListener('change', function() {
            const antecedenteSelect = document.getElementById('antecedenteClasse');
            const classeSelecionada = this.value;
            
            // Mapeamento de classes para antecedentes
            const antecedentes = {
                'Bárbaro': ['Acólito', 'Criminoso', 'Herói do Povo', 'Artesão de Guilda', 'Eremita', 'Nobre', 'Forasteiro', 'Marinheiro', 'Sábio', 'Soldado', 'Orfão'],
                'Bardo': ['Acólito', 'Criminoso', 'Herói do Povo', 'Artesão de Guilda', 'Eremita', 'Nobre', 'Forasteiro', 'Marinheiro', 'Sábio', 'Soldado', 'Orfão'],
                'Bruxo': ['Acólito', 'Criminoso', 'Herói do Povo', 'Artesão de Guilda', 'Eremita', 'Nobre', 'Forasteiro', 'Marinheiro', 'Sábio', 'Soldado', 'Orfão'],
                'Clérigo': ['Acólito', 'Criminoso', 'Herói do Povo', 'Artesão de Guilda', 'Eremita', 'Nobre', 'Forasteiro', 'Marinheiro', 'Sábio', 'Soldado', 'Orfão'],
                'Druida': ['Acólito', 'Criminoso', 'Herói do Povo', 'Artesão de Guilda', 'Eremita', 'Nobre', 'Forasteiro', 'Marinheiro', 'Sábio', 'Soldado', 'Orfão'],
                'Feiticeiro': ['Acólito', 'Criminoso', 'Herói do Povo', 'Artesão de Guilda', 'Eremita', 'Nobre', 'Forasteiro', 'Marinheiro', 'Sábio', 'Soldado', 'Orfão'],
                'Guardião': ['Acólito', 'Criminoso', 'Herói do Povo', 'Artesão de Guilda', 'Eremita', 'Nobre', 'Forasteiro', 'Marinheiro', 'Sábio', 'Soldado', 'Orfão'],
                'Guerreiro': ['Acólito', 'Criminoso', 'Herói do Povo', 'Artesão de Guilda', 'Eremita', 'Nobre', 'Forasteiro', 'Marinheiro', 'Sábio', 'Soldado', 'Orfão'],
                'Ladino': ['Acólito', 'Criminoso', 'Herói do Povo', 'Artesão de Guilda', 'Eremita', 'Nobre', 'Forasteiro', 'Marinheiro', 'Sábio', 'Soldado', 'Orfão'],
                'Mago': ['Acólito', 'Criminoso', 'Herói do Povo', 'Artesão de Guilda', 'Eremita', 'Nobre', 'Forasteiro', 'Marinheiro', 'Sábio', 'Soldado', 'Orfão'],
                'Monge': ['Acólito', 'Criminoso', 'Herói do Povo', 'Artesão de Guilda', 'Eremita', 'Nobre', 'Forasteiro', 'Marinheiro', 'Sábio', 'Soldado', 'Orfão'],
                'Paladino': ['Acólito', 'Criminoso', 'Herói do Povo', 'Artesão de Guilda', 'Eremita', 'Nobre', 'Forasteiro', 'Marinheiro', 'Sábio', 'Soldado', 'Orfão'],
            };
            
            // Habilitar ou desabilitar o campo de seleção do antecedente de classe
            if (classeSelecionada in antecedentes) {
                const antecedentesDaClasse = antecedentes[classeSelecionada];
                antecedenteSelect.innerHTML = ''; // Limpar opções existentes
                
                if (antecedentesDaClasse.length === 0) {
                    antecedenteSelect.disabled = true;
                } else {
                    antecedenteSelect.disabled = false;
                    antecedentesDaClasse.forEach(function(antecedente) {
                        const option = document.createElement('option');
                        option.value = antecedente;
                        option.textContent = antecedente;
                        antecedenteSelect.appendChild(option);
                    });
                }
            } else {
                antecedenteSelect.innerHTML = '<option value="">Selecione uma classe primeiro</option>';
                antecedenteSelect.disabled = true;
            }
        });

        const equipamentosAntecedente = {
            'Acólito': [
                'Um símbolo sagrado (um presente dado quando você entrou no templo)',
                'Um livro de preces ou uma conta de orações',
                '5 varetas de incenso',
                'Vestimentas',
                'Um conjunto de roupas comuns',
                'Uma algibeira contendo 15 po'
            ],
            'Artesão de Guilda': [
                'Um conjunto de ferramentas de artesão (à sua escolha)',
                'Uma carta de apresentação da sua guilda',
                'Um conjunto de roupas de viajante',
                'Uma algibeira com 15 po'
            ],
            'Artista':[
                'Um instrumento musical (à sua escolha)',
                'Um presente de um admirador (carta de amor, mecha de cabelo ou uma bijuteria)', 
                'Um traje',
                'Uma algibeira contendo 15 po'
            ],
            'Charlatão': [
                'Um conjunto de roupas finas',
                'Um kit de disfarce',
                'Ferramentas de trapaça à sua escolha (dez garrafas tampadas preenchidas com líquidos coloridos, um conjunto de dados viciados, um baralho de cartas marcadas ou um anel de sinete de um duque imaginário)',
                'Uma algibeira contendo 15 po'
            ],
            'Criminoso': [
                'Um pé de cabra',
                'Um conjunto de roupas escuras comuns com capuz',
                'Uma algibeira contendo 15 po'
            ],
            'Eremita': [
                'Um estojo de pergaminho cheio de notas dos seus estudos e orações',
                'Um cobertor de inverno',
                'Um conjunto de roupas comuns',
                'Um kit de herbalismo',
                '5 po'
            ],
            'Forasteiro': [
                'Um bordão',
                'Uma armadilha de caça',
                'Um fetiche de um animal que você matou',
                'Um conjunto de roupas de viajante',
                'Uma algibeira contendo 10 po'
            ],
            'Herói do Povo': [
                'Um conjunto de ferramentas de artesão (à sua escolha)',
                'Uma pá',
                'Um pote de ferro',
                'Um conjunto de roupas comuns',
                'Uma algibeira contendo 10 po'
            ],
            'Marinheiro': [
                'Uma malagueta (clava)',
                '15 metros de corda de seda',
                'Um amuleto da sorte como um pé de coelho ou uma pequena pedra com um furo no centro',
                '(ou você pode rolar uma bugiganga da tabela Bugigangas no capítulo 5)',
                'Um conjunto de trajes comuns',
                'Uma algibeira contendo 10 po'
            ],
            'Nobre': [
                'Um conjunto de trajes finos',
                'Um anel de sinete',
                'Um pergaminho de linhagem',
                'Uma algibeira contendo 25 po'
            ],
            'Orfão': [
                'Uma faca pequena',
                'Um mapa da cidade em que você cresceu',
                'Um rato de estimação',
                'Um pequeno objeto para lembrar dos seus pais',
                'Um conjunto de roupas comuns',
                'Uma algibeira contendo 10 po'
            ],
            'Sábio': [
                'Um vidro de tinta escura',
                'Uma pena',
                'Uma faca pequena',
                'Uma carta de um falecido colega perguntando a você algo que você nunca terá a chance de responder',
                'Um conjunto de roupas comuns',
                'Uma algibeira contendo 10 po'
            ],
            'Soldado': [
                'Uma insígnia de patente',
                'Um fetiche obtido de um inimigo caído (uma adaga, lâmina partida ou tira de estandarte)',
                'Um conjunto de dados de osso ou baralho',
                'Um conjunto de roupas comuns',
                'Uma algibeira contendo 10 po'
            ],
        };

        const periciasclasses = {
            Bárbaro: ['Adestrar Animais', 'Atletismo', 'Intimidação', 'Natureza', 'Percepção', 'Sobrevivência'],
            Bardo: ['Acrobacia', 'Atletismo', 'Atuação', 'Enganação', 'Furtividade', 'História', 'Intuição', 'Investigação', 'Medicina', 'Natureza', 'Percepção', 'Persuasão', 'Prestidigitação', 'Religião'],
            Bruxo: ['Arcanismo', 'Enganação', 'História', 'Intimidação', 'Investigação', 'Natureza', 'Religião'],
            Clérigo: ['História', 'Intuição', 'Medicina', 'Persuasão', 'Religião'],
            Druida: ['Adestrar Animais', 'Arcanismo', 'Intuição', 'Medicina', 'Natureza', 'Percepção', 'Religião'],
            Feiticeiro: ['Arcanismo', 'Enganação', 'Intimidação', 'Investigação', 'Natureza', 'Religião'],
            Guerreiro: ['Adestrar Animais', 'Atletismo', 'Intimidação', 'Intuição', 'Percepção', 'Sobrevivência'],
            Ladino: ['Acrobacia', 'Atletismo', 'Enganação', 'Furtividade', 'Intuição', 'Investigação', 'Ladinagem', 'Percepção', 'Persuasão', 'Prestidigitação'],
            Mago: ['Arcanismo', 'História', 'Intuição', 'Investigação', 'Medicina', 'Religião'],
            Paladino: ['Atletismo', 'Intimidação', 'Intuição', 'Medicina', 'Persuasão', 'Religião'],
            Patrulheiro: ['Adestrar Animais', 'Atletismo', 'Furtividade', 'Intuição', 'Natureza', 'Percepção', 'Sobrevivência'],
            Monge: ['Adestrar Animais', 'Atletismo', 'Enganação', 'Intimidação', 'Ladinagem', 'Sobrevivência']
        };

        const proeficencia = {
            'Artesão de guilda': ['Um tipo de ferramenta de artesão'],
            'Artista': ['Kit de disfarce, um tipo de instrumento musical'],
            'Charlatão': ['Kit de disfarce, kit de falsificação'],
            'Criminoso': ['Um tipo de kit de jogo, ferramentas de ladrão'],
            'Eremita': ['Kit de herbalismo'],
            'Forasteiro': ['Um tipo de instrumento musical'],
            'Herói do povo': ['Um tipo de ferramenta de artesão, veículos (terrestre)'],
            'Marinheiro': ['Ferramentas de navegador, veículo (aquático)'],
            'Nobre': ['Um tipo de kit de jogos'],
            'Órfão': ['Kit de disfarce, ferramentas de ladrão'],
            'Sábio': ['Não possui proficiência em ferramentas'],
            'Soldado': ['Um tipo de kit de jogo, veículo (terrestre)']
        };

        document.getElementById('antecedenteClasse').addEventListener('change', function () {
            const antecedenteSelecionado = this.value;
            const equipamentosContainerA = document.getElementById('equipamentosA');
            const equipamentosContainerB = document.getElementById('equipamentosB');
            const ferramentasContainerX = document.getElementById('ferramentasX');
            const ferramentasContainerY = document.getElementById('ferramentasY');
            const idiomasContainerA = document.getElementById('idiomasExtrasA');
            const idiomasContainerB = document.getElementById('idiomasExtrasB');
        
            // Limpar equipamentos, ferramentas e idiomas existentes
            equipamentosContainerA.innerHTML = '';
            equipamentosContainerB.innerHTML = '';
            ferramentasContainerX.innerHTML = '';
            ferramentasContainerY.innerHTML = '';
            idiomasContainerA.innerHTML = '';
            idiomasContainerB.innerHTML = '';
        
            // Adicionar novos equipamentos, ferramentas e idiomas com base na seleção do antecedente
            if (antecedenteSelecionado in equipamentosAntecedente) {
                const equipamentosDoAntecedente = equipamentosAntecedente[antecedenteSelecionado];
        
                // Dividir os equipamentos em duas colunas
                const metadeEquipamentos = Math.ceil(equipamentosDoAntecedente.length / 2);
                const equipamentosColunaA = equipamentosDoAntecedente.slice(0, metadeEquipamentos);
                const equipamentosColunaB = equipamentosDoAntecedente.slice(metadeEquipamentos);
        
                // Adicionar à primeira coluna
                equipamentosColunaA.forEach(function (equipamento) {
                    const paragrafo = document.createElement('p');
                    paragrafo.textContent = equipamento;
                    equipamentosContainerA.appendChild(paragrafo);
                });
        
                // Adicionar à segunda coluna
                equipamentosColunaB.forEach(function (equipamento) {
                    const paragrafo = document.createElement('p');
                    paragrafo.textContent = equipamento;
                    equipamentosContainerB.appendChild(paragrafo);
                });
            }
        
            if (antecedenteSelecionado in proeficiencia) {
                const proeficienciaDoAntecedente = proeficiencia[antecedenteSelecionado];
        
                // Dividir as ferramentas em duas colunas
                const metadeFerramentas = Math.ceil(proeficienciaDoAntecedente.length / 2);
                const ferramentasColunaX = proeficienciaDoAntecedente.slice(0, metadeFerramentas);
                const ferramentasColunaY = proeficienciaDoAntecedente.slice(metadeFerramentas);
        
                // Adicionar à primeira coluna
                ferramentasColunaX.forEach(function (ferramenta) {
                    const paragrafo = document.createElement('p');
                    paragrafo.textContent = ferramenta;
                    ferramentasContainerX.appendChild(paragrafo);
                });
        
                // Adicionar à segunda coluna
                ferramentasColunaY.forEach(function (ferramenta) {
                    const paragrafo = document.createElement('p');
                    paragrafo.textContent = ferramenta;
                    ferramentasContainerY.appendChild(paragrafo);
                });
            }
        
            if (antecedenteSelecionado in idiomasAntecedente) {
                const idiomasDoAntecedente = idiomasAntecedente[antecedenteSelecionado];
        
                // Dividir os idiomas em duas colunas
                const metadeIdiomas = Math.ceil(idiomasDoAntecedente.length / 2);
                const idiomasColunaA = idiomasDoAntecedente.slice(0, metadeIdiomas);
                const idiomasColunaB = idiomasDoAntecedente.slice(metadeIdiomas);
        
                // Adicionar à primeira coluna
                idiomasColunaA.forEach(function (idioma) {
                    const paragrafo = document.createElement('p');
                    paragrafo.textContent = idioma;
                    idiomasContainerA.appendChild(paragrafo);
                });
        
                // Adicionar à segunda coluna
                idiomasColunaB.forEach(function (idioma) {
                    const paragrafo = document.createElement('p');
                    paragrafo.textContent = idioma;
                    idiomasContainerB.appendChild(paragrafo);
                });
            }
        });

        document.getElementById('antecedenteClasse').dispatchEvent(new Event('change'));
        
        function atualizarPericias() {
            console.log('Função atualizarPericias chamada');
    
           // Obtenha referências aos elementos relevantes do DOM
            const classePersonagem = document.getElementById('classePersonagem');
            const periciasContainer = document.getElementById('periciasContainer');

            // Adicione um ouvinte de eventos para o evento de alteração na classe do personagem
            classePersonagem.addEventListener('change', atualizarPericias);

            // Função para atualizar as opções de perícias com base na classe selecionada
            function atualizarPericias() {
                // Limpe as perícias existentes
                periciasContainer.innerHTML = '';

                // Obtenha a classe selecionada
                const classeSelecionada = classePersonagem.value;

                // Obtenha as perícias e o limite associado à classe selecionada
                const periciasDaClasse = periciasclasses[classeSelecionada] || [];
                const limiteDePericias = limitePericias[classeSelecionada] || 0;

                // Adicione as perícias como opções
                periciasDaClasse.forEach(pericia => {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = 'pericia';
                    checkbox.value = pericia;
                    checkbox.id = pericia.toLowerCase().replace(/ /g, ''); // Remover espaços e tornar minúsculas para IDs únicos

                    const label = document.createElement('label');
                    label.htmlFor = checkbox.id;
                    label.appendChild(document.createTextNode(pericia));

                    periciasContainer.appendChild(checkbox);
                    periciasContainer.appendChild(label);
                    periciasContainer.appendChild(document.createElement('br'));
                });

                // Adicione um contador para o número de perícias selecionadas
                const contadorPericias = document.createElement('p');
                contadorPericias.innerHTML = `Perícias selecionadas: <span id="contador">${limiteDePericias}</span>/${limiteDePericias}`;
                periciasContainer.appendChild(contadorPericias);

                // Adicione ouvintes de eventos para atualizar o contador ao selecionar/deselecionar perícias
                const checkboxes = document.querySelectorAll('input[name="pericia"]');
                checkboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', () => atualizarContador(contadorPericias, checkboxes, limiteDePericias));
                });
            }

            // Função para atualizar o contador de perícias selecionadas
            function atualizarContador(contadorElemento, checkboxes, limiteDePericias) {
                const periciasSelecionadas = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
                contadorElemento.innerHTML = `Perícias selecionadas: <span id="contador">${periciasSelecionadas}</span>/${limiteDePericias}`;

                // Desabilitar/abilitar checkboxes com base no limite
                checkboxes.forEach(checkbox => {
                    checkbox.disabled = periciasSelecionadas >= limiteDePericias && !checkbox.checked;
                });
            }

            // Inicialize as perícias com base na classe padrão
            atualizarPericias();
    
            // Limpa as perícias existentes no contêiner
            periciasContainer.innerHTML = '';
    
            if (classeSelecionada && periciasclasses[classeSelecionada]) {
                const periciasDaClasse = periciasclasses[classeSelecionada];
    
                // Itera sobre as perícias da classe e cria os elementos HTML
                periciasDaClasse.forEach(pericia => {
                    const divFormCheck = document.createElement('div');
                    divFormCheck.className = 'form-check';
    
                    const inputRadio = document.createElement('input');
                    inputRadio.type = 'radio';
                    inputRadio.name = 'pericia';
                    inputRadio.className = 'form-check-input';
                    inputRadio.id = pericia;
    
                    const label = document.createElement('label');
                    label.className = 'form-check-label';
                    label.htmlFor = pericia;
                    label.textContent = pericia;
    
                    divFormCheck.appendChild(inputRadio);
                    divFormCheck.appendChild(label);
    
                    // Adiciona a div ao contêiner de perícias
                    periciasContainer.appendChild(divFormCheck);
                });
            }
        }

        updateAntecedenteEquipments();

        // Função para tornar checkboxes mutuamente exclusivos
        function allowOnlyOneSelection() {
            const equipamentoCheckboxesA = document.querySelectorAll('input[name="equipamentosA"]');
            const equipamentoCheckboxesB = document.querySelectorAll('input[name="equipamentosB"]');

            equipamentoCheckboxesA.forEach(checkbox => {
                checkbox.addEventListener('change', function () {
                    if (this.checked) {
                        // Desmarcar o outro checkbox do par
                        const otherCheckbox = document.getElementById(this.id.replace('a', 'b'));
                        otherCheckbox.checked = false;
                    }
                });
            });

            equipamentoCheckboxesB.forEach(checkbox => {
                checkbox.addEventListener('change', function () {
                    if (this.checked) {
                        // Desmarcar o outro checkbox do par
                        const otherCheckbox = document.getElementById(this.id.replace('b', 'a'));
                        otherCheckbox.checked = false;
                    }
                });
            });

            // Permite apenas uma seleção na seção de perícias
            const periciasSelect = document.getElementById('antecedentePericias');
            periciasSelect.addEventListener('change', function() {
                const selectedOption = this.options[this.selectedIndex];
                const selectedValue = selectedOption.value;

                // Verifique se o valor já foi selecionado em outro atributo
                if (selectedValues[selectedValue] > 1) {
                    alert('Esta perícia já foi selecionada. Escolha outra perícia.');
                    this.selectedIndex = 0;
                } else {
                    selectedValues[selectedValue] = (selectedValues[selectedValue] || 0) + 1;
                }
            });
            
        }
    
        // Chame a função quando a classe do personagem é alterada
        document.getElementById('classePersonagem').addEventListener('change', atualizarEquipamentos);