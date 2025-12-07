import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ModelA(contractToPdf: any, clientContract: any, vehicleContract: any) {
    
 try {

    if (!contractToPdf || !clientContract || !vehicleContract) {
      alert('Não foi possível encontrar todos os dados necessários para gerar o contrato.');
      return;
    }
    
    // Format dates
    const startDateFormatted = new Date(contractToPdf.data_inicio).toLocaleDateString('pt-BR');
    const endDateFormatted = new Date(contractToPdf.data_final).toLocaleDateString('pt-BR');
    const creationDateFormatted = new Date(contractToPdf.data_criacao).toLocaleDateString('pt-BR');
    
    // Create PDF instance
    const doc = new jsPDF();
    let yPosition = 20;
    const lineHeight = 5.3;
    const margin = 20;
    const maxWidth = 170;
    
    const addText = (text: string, isBold = false, fontSize = 10, colorType: number = 0) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');

        switch(colorType) {
          case 1: // Vermelho
            doc.setTextColor(255, 0, 0);
            break;
          case 2: // Azul
            doc.setTextColor(0, 0, 255);
            break;
          case 3: // Verde
            doc.setTextColor(0, 128, 0);
            break;
          default: // Preto (padrão)
            doc.setTextColor(0, 0, 0);
        }

      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, margin, yPosition);
      yPosition += (lines.length * lineHeight) + 2;
    };

    const addEmptyLine = () => {
      yPosition += 2;
    };
    
    
    addText('CONTRATO DE LOCAÇÃO DE AUTOMÓVEL DE PRAZO DETERMINADO', true, 14);
    addEmptyLine();
    addText('IDENTIFICAÇÃO DAS PARTES CONTRATANTES', true, 12);
    addEmptyLine();
    addText('LOCADOR: Eridelsom Dias Moreira, residente na Rua: Desembargador Antônio Miguel Feu Rosa, nº 479, Condomínio Praças Reserva - Bloco: 07 - Apartamento; 301 - Praia da Baleia - Cep: 29.172-680, no Estado do Espírito Santo- ES, neste ato representada como proprietário do carro - Brasileiro, Casado - Empresario, RG: 1.895.253 - ES e CPF: 093.523.627-99;');
    addText(`LOCATÁRIO: ${clientContract.nome}, Brasileiro - RG: ${clientContract.rg} CPF: ${clientContract.cpf}, residente e domiciliado na ${clientContract.endereco}, ${clientContract.numero} - ${clientContract.bairro} - ${clientContract.cidade} - ${clientContract.estado} - CEP: ${clientContract.cep}`);
    addEmptyLine();
    addText('As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Locação de Automóvel de Prazo Determinado, que se regerá pelas cláusulas seguintes e pelas condições descritas no presente.',true);
    addEmptyLine();
    addText('CLÁUSULA PRIMEIRA - OBJETO DO CONTRATO', true);
    addText(`1.1 O presente contrato tem como OBJETO a locação do automóvel marca ${vehicleContract.marca}, modelo ${vehicleContract.modelo}, ano ${vehicleContract.ano}, COR ${vehicleContract.cor}, Placa: ${vehicleContract.placa} - RENAVAM: ${vehicleContract.renavam} de propriedade do LOCADOR.`);
    addEmptyLine();
    addText('CLAUSULA SEGUNDA - PRAZO', true);
    addText('2.1 O prazo da locação e o local de devolução do carro estarão registrados no Contrato como "Data e Local de Devolução".');
    addText('2.2 O período máximo de cada locação é de 10 dias. Findo esse prazo, deverá ser assinado um novo Contrato vinculado às Condições Gerais e Tarifário vigentes na época da renovação.');
    addText('2.3. Havendo prorrogação da locação, permanecerão em vigor todos os termos das Condições Gerais, ficando o Cliente sujeito às eventuais variações de preços do Tarifário e à perda de negociação realizada em locação anterior.');
    addText('2.4. A prorrogação da locação para Cliente Pessoa Física dependerá de pagamento antecipado ou de nova pré-autorização com deposito em conta corrente indicada pelo LOCADOR.');
    addEmptyLine();
    addText('CLÁUSULA TERCEIRA - O PREÇO', true);
    addText('3.1. O preço final do aluguel será apurado no fechamento ou na rescisão do Contrato e compreenderá o somatório dos valores dos seguintes itens descritos no Tarifário:');
    addText(`Caução: R$ ${contractToPdf.caucao || '00'}`, true, 10, 1);
    addText(`Locação: R$ ${contractToPdf.valor_locacao || '00'} na retirada do carro`, true, 10, 1);
    addText(`O carro está sendo entregue no dia ${startDateFormatted} - ${contractToPdf.hora_entrega || '0h'} e será devolvido no dia ${endDateFormatted} - ${contractToPdf.hora_entrega || '0h'}`, true, 10, 1);
    addText(`Franquia KM Contratado: ${contractToPdf.franquia || '0'} KMs`, true, 10, 1);
    addText('KM Excedente: R$ 1,20  por KM Rodado.', true, 10, 1);
    addEmptyLine();
    addText('Das opções de Pagamento:', true, 10, 1);
    addText('PIX: 093.523.627-99', true, 10, 1);
    addText('PIC PAY: Eridelson.dias.moreira', true, 10, 1);
    addEmptyLine();
    
    addText('3.1.1. A diária do carro é de 24 horas,');
    addText('a. a partir da hora de retirada do carro, com até 1 hora de tolerância para devolução.');
    addText('b. Horas Extras: a partir da 25ª hora da retirada do carro, incidirá cobrança de hora extra, calculada na proporção de 1/5 do valor da diária para cada hora extra, sendo cobrada, inclusive, a hora de tolerância, quando devolvido após as 25 horas de locação.');
    addEmptyLine();

    // CLÁUSULA QUARTA
    addText('CLÁUSULA QUARTA: REEMBOLSO DE DESPESAS', true);
    addText('4.1. Combustível: caso o carro não seja devolvido totalmente abastecido, será cobrado o reembolso de um tanque cheio com base no valor do Litro do combustível multiplicado pela capacidade do tanque.');
    addText('4.2 Lavagem do Carro: caso o carro seja devolvido sujo, será cobrada a lavagem simples ou especial dependendo do nível de sujidade na entrega dele;');
    addText('4.3. Chave do Carro: quando não for devolvida, será cobrado o reembolso da despesa para nova confecção, acrescida de indenização no valor de 1 diária de locação;');
    addText('4.4. Despachantes: o Cliente poderá optar pela contratação de despachantes do Locador para desembaraçar eventuais ocorrências com o carro, inclusive para retirar Boletins de Ocorrências em delegacias.');
    addEmptyLine();

    // CLÁUSULA QUINTA
    addText('CLÁUSULA QUINTA - UTILIZAÇÃO DO VEÍCULO', true);
    addEmptyLine();
    addText('5.1. O automóvel, objeto deste contrato, será utilizado exclusivamente pelo LOCATÁRIO, não sendo permitido o seu uso por terceiros sob pena de rescisão contratual e o pagamento da multa no valor de 30% sobre o total de locação.', true, 10, 1);
    addEmptyLine();
    addText('5.2. Infração de Trânsito: o cliente deverá reembolsar o Locador o valor da infração acrescido do percentual previsto no Tarifário vigente, a título de processamento administrativo. A transferência de pontuação e pagamentos dos valores devendo para tal disponibilizar a documentação requerida e no prazo indicado pelo Departamento de Trânsito do Espírito Santo/ES.');
    addEmptyLine();
    addText('5.3. Reboque/Guincho: será cobrado o valor correspondente a 1 diária de locação do carro quando o evento ocorrer a uma distância de até 100 quilômetros da residência do LOCATARIO. Para distâncias superiores, o valor será equivalente ao valor do Retorno de ida e volta entre o local do evento e o local de retirada do Veículo.');
    addText('Não haverá cobrança do reboque quando utilizado por culpa do LOCADOR.');
    addText('5.4. Apreensão do Carro: além do valor de Despachantes, quando contratado, o Cliente deverá reembolsar as despesas do LOCADOR com advogados para liberação e recuperação do carro, além das taxas cobradas pelos órgãos competentes.');
    addText('5.5. Acessórios e Pneumáticos: o Cliente deverá arcar com o valor integral dos acessórios e pneumáticos em casos de furto, roubo ou danos.');
    addEmptyLine();

    // CLAUSULA SEXTA
    addText('CLAUSULA SEXTA - USO INADEQUADO', true);
    addText('6.1. É a ocorrência de qualquer das situações abaixo envolvendo o carro alugado:');
    addText('a. Transporte de pessoas e/ou bens mediante remuneração.');
    addText('b. Transporte de pessoas e/ou bens além da capacidade informada pelo fabricante.');
    addText('c. Guincho e/ou reboque do carro alugado efetuado por veículo não apropriado a esse fim.');
    addText('d. Participação em corridas, "rachas" ou "pegas", testes, rally, reconhecimento de trecho para rally, disputa ou competição automobilística, gincanas ou afins.');
    addText('e. Instrução de pessoas não habilitadas e treinamento de motoristas em qualquer situação.');
    addText('f. Transporte de explosivos e/ou materiais químicos ou inflamáveis.');
    addText('g. Tráfego em dunas, praias, estradas ou caminhos impedidos, não abertos ao tráfego, ou em areias fofas ou movediças.');
    addText('h. Submersão total ou parcial do veículo em água.');
    addText('i. Circulação com as luzes de advertência de óleo ou de temperatura acesas no painel de instrumentos, hipótese em que se o carro persistir em funcionamento, mesmo por pouco tempo, ocorrerão danos ao motor, os quais serão identificados por meio de laudo técnico, sob acompanhamento do Cliente que manifestar interesse.');
    addText('j. Acidente causado por condutor sob ação de álcool/ entorpecentes ou se o condutor não fizer o teste de embriaguez requerido pela autoridade.');
    addText('k. Transporte de criança sem o uso dos dispositivos de retenção apropriados.');
    addText('l. Cessão do carro alugado a terceiros sem prévia autorização formal do Locador.');
    addText('m. Circulação fora do território nacional.');
    addText('n. Manifesta negligência na guarda do carro, tal como deixá-lo abandonado/estacionado em local ermo ou com as portas/vidros abertos/destravados, chave na ignição ou situação equivalente.');
    addText('o. Quaisquer finalidades ilegais.');
    addEmptyLine();

    // CLAUSULA SETIMA
    addText('CLAUSULA SETIMA - RESPONSABILIDADES DO LOCADOR', true);
    addText('7.1. Disponibilizar o carro limpo, totalmente abastecido, em perfeitas condições de funcionamento e segurança, com todos os equipamentos e documentos exigidos pelo Código de Trânsito.');
    addText('7.2. Garantir a reserva pelo prazo de até 1 hora após o horário previsto para a retirada do carro, condicionada ao horário Administrativo;');
    addText('7.3. Garantir o atendimento com o carro na categoria reservada.');
    addText('7.4. Substituir o carro sem ônus para o Cliente em caso de pane por defeito eletromecânico oriundo de seu uso normal.');
    addText('7.4.2. Se for apurado que a pane foi causada por acidente, originado por culpa ou dolo do Cliente, por Uso Inadequado ou, ainda, se o pedido de remoção tiver sido desnecessário (ex.: falta de combustível), o Cliente deverá arcar com o valor do reboque mais o valor de 1 diária de locação.');
    addText('7.4.3. O Locador não substituirá o carro em caso de furto, roubo, incêndio, colisão, apropriação indébita, apreensão por autoridades, perda, furto ou roubo de chaves e documentos ou pane provocada por Uso Inadequado. Nessas hipóteses, o Contrato será considerado automaticamente encerrado. A Locadora, a seu critério, poderá alugar outro carro caso o Cliente deseje, não se caracterizando novação ou renúncia a qualquer direito decorrente do Contrato anterior.');
    addEmptyLine();

    // CLAUSULA OITAVA
    addText('CLAUSULA OITAVA - RESPONSABILIDADES DO CLIENTE', true);
    addText('8.1. Recebimento, guarda e uso do carro:');
    addText('8.1.1. O LOCATARIO deverá apresentar, na retirada do carro, a sua carteira de habilitação original, CPF e carteira de identidade, para fins de identificação, cópia e arquivo.');
    addText('8.1.2. O LOCATARIO é responsável pelo recebimento, guarda e uso do carro, conforme o Contrato.');
    addText('8.1.3. O LOCATARIO assume a posse autônoma do carro, para todos os fins de direito.');
    addText('8.1.4. O LOCATARIO se compromete a utilizar o carro somente em território nacional.');
    addText('8.1.5. O LOCATARIO se obriga a não efetuar qualquer reparo ou serviço no carro sem a expressa e prévia anuência do Locador, sob pena de não ser reembolsado por tais serviços e ainda arcar com eventuais danos ao carro.');
    addText('8.1.6. O LOCATARIO deverá comunicar imediatamente ao Locador qualquer acidente com o carro e providenciar no prazo máximo de 48 horas:');
    addText('a. Preenchimento do aviso de acidente/sinistro da Locadora;');
    addText('b. Entrega do Boletim de Ocorrência ou comprovante do seu protocolo;');
    addText('c. Laudo pericial ou seu protocolo quando houver capotamento do carro ou vítima fatal.');
    addEmptyLine();
    
    addText('8.2. Devolução do Carro:');
    addText('8.2.1. O Cliente será responsável pela devolução do carro na data/hora e local definidas no Contrato.');
    addText('8.2.2. Na hipótese de acidente, incêndio, apropriação indébita, apreensão ou reboque do carro, o encerramento da locação só ocorrerá quando a Locadora estiver na posse do mesmo. Se o Cliente não for culpado pelo acidente ou incêndio, a Locadora reconhecerá o encerramento da locação na data do acidente ou incêndio indicada no Boletim de Ocorrência.');
    addText('8.2.3. Ocorrendo furto ou roubo do carro, a data de encerramento da locação será a data/hora da lavratura do Boletim de Ocorrência.');
    addText('8.2.4. O atraso na devolução do carro por período superior a 24 horas caracterizará, automaticamente, apropriação indébita.', true);
    addText('a. Nessa hipótese, o Cliente ficará sujeito às responsabilidades penais e civis, arcando ainda com todas as despesas do Locador para sua reintegração na posse do carro.');
    addText('b. A data de encerramento da locação será a data/hora da lavratura do Boletim de Ocorrência.');
    addEmptyLine();
    
    addText('8.3. Responsabilidades Indenizatórias:');
    addText('8.3.1. O LOCATARIO reconhece que as responsabilidades do Locador se limitam àquelas previstas na legislação brasileira, cabendo ao Cliente arcar com o ônus da sua conduta dolosa ou culposa, inclusive perante terceiros.');
    addText('8.3.2. O Cliente deverá suportar as seguintes responsabilidades indenizatórias:');
    addText('a. Em caso de furto, roubo ou apropriação indébita: ressarcir o Locador o valor de mercado do modelo do carro, taxas de licenciamento, IPVA, um tanque de combustível e Indenização por Custos Operacionais, conforme limites expressos no Tarifário. Caso a Locadora recupere o carro após o pagamento integral das indenizações, ela transferirá ao Cliente o carro recuperado, no estado em que se encontrar. No caso de carro recuperado de apropriação indébita, o Cliente deverá suportar, também, as diárias de locação, desde a retirada até a efetiva devolução do carro à Locadora.');
    addEmptyLine();
    
    addText('8.3.3. O LOCATARIO aceita que o Locador promova o seu chamamento aos processos judiciais movidos por terceiros, cabendo-lhe assumir isoladamente todos os ônus dessas demandas.');
    addText('8.3.4. O recebimento de qualquer valor pela Locadora não presume a quitação total de seus prejuízos.');
    addEmptyLine();
    
    addText('8.4. Multas por Infração de Trânsito:');
    addText('8.4.1. O LOCATARIO concorda que a Locadora irá indicá-lo como condutor/infrator responsável pelas infrações de trânsito apuradas durante a locação, nos termos do artigo 257, parágrafos 1º, 3º, 7º e 8º do Código de Trânsito. A partir da indicação, o Cliente terá legitimidade para se defender perante o órgão atuador.');
    addText('8.4.2. Qualquer questionamento sobre eventual improcedência de multas de trânsito deverá ser feito pelo Cliente exclusivamente perante o órgão autuador.');
    addText('8.4.3. O LOCATARIO reconhece que o Locador, na condição de proprietária do carro alugado, é responsável por quitar a multa junto ao Órgão de Trânsito após ser notificada da infração e cobrará o reembolso do Cliente, acrescido dos encargos previstos nestas Condições Gerais, constituindo se dívida líquida e certa, mesmo em casos de recursos em julgamento.');
    addText('8.4.4. Na hipótese de o LOCATARIO ser abordado por agente de trânsito e receber o Auto de Infração/Notificação, deverá avisar ao Locador e lhe entregar a cópia da notificação.');
    addText('8.4.5. Se o LOCATARIO optar por recorrer da autuação e, sendo o recurso vitorioso, o Locador lhe fornecerá cópia da guia de pagamento para que ele solicite ao órgão o reembolso.');
    addText('8.4.6. O LOCATARIO se obriga a ressarcir o Locador todos os valores relativos às multas de trânsito ocorridas durante a locação, mesmo que a Locadora não seja notificada dentro do prazo legal. Nesses casos, o Locador poderá recorrer, e, sendo o recurso provido, repassará ao O LOCATARIO cópia da guia de pagamento para que ele solicite o reembolso ao órgão autuador.');
    addEmptyLine();
    
    addText('8.5. Pagamento da Locação:');
    addText('8.5.1. O Cliente se obriga ao pagamento de todos os débitos decorrentes do aluguel até a devolução do carro.');
    addText('8.5.3. Todos os valores, despesas e encargos da locação constituem-se dívidas líquidas e certas para pagamento à vista, passíveis de cobrança executiva.');
    addText('8.5.4. A Locadora fica desde já autorizada a cobrar diretamente, via bancos, ou debitar automaticamente esses valores no cartão de crédito do LOCATARIO, por meio do sistema de assinatura em arquivo, mesmo que as despesas tenham sido apuradas após o encerramento do Contrato. O envio dos documentos de cobrança poderá ser feito por meio impresso ou eletrônico, a critério exclusivo da Locadora. É de responsabilidade exclusiva do LOCATARIO informar e atualizar os dados do responsável pelo recebimento das faturas por meio eletrônico e/ou físico, sob pena dos mesmos serem considerados entregues.');
   
    addText('CLAUSULA NONA - SEGURO DISPONIBILIZADO PELO LOCADOR', true);
    addText('9.1. O LOCADOR, na condição de estipulante de seguro, disponibiliza ao Cliente a opção de Cobertura de seguro incluso na locação referentes a danos causados ao carro alugado em virtude de colisão, incêndio, roubo, furto ("Seguro do Carro") e responsabilidade civil perante terceiros ("Seguro para Terceiros"), em decorrência de acidente de trânsito envolvendo o carro alugado/segurado, nos termos das Condições Gerais do Seguro de Automóvel.');
    addText('9.2.1. O Seguro do Carro oferece cobertura exclusivamente para furto, roubo, incêndio ou avarias no carro alugado.');
    addText('9.2.2. O Seguro para Terceiros oferece cobertura exclusivamente para danos materiais, corporais e morais a terceiros.');
    addText('9.2.3. A aceitação do seguro estará sujeita à análise de risco.');
    addEmptyLine();
    
    addText('9.3. A Apólice não oferecerá cobertura para:');
    addText('9.3.1. Agravar intencionalmente o risco.');
    addText('9.3.2. Provocar ou simular sinistro.');
    addText('9.3.3. Sinistro causado por pessoa sob ação de álcool/ entorpecentes ou se o condutor não fizer o teste de embriaguez requerido pela autoridade.');
    addText('9.3.4. Deixar de apresentar Boletim de Ocorrência em caso de sinistro com o carro alugado.');
    addText('9.3.5. Procurar obter benefícios ilícitos do Seguro.');
    addText('9.3.6. Deixar de comunicar a ocorrência de sinistro, logo que o saiba.');
    addText('9.3.7. Deixar de preencher o aviso do sinistro.');
    addText('9.3.8. Deixar de pagar integralmente o valor do prêmio do Seguro.');
    addText('9.3.9. Deixar de comunicar, por escrito, à Locadora ou à Seguradora sua pretensão de obter novo Seguro sobre o mesmo interesse e risco em outra Seguradora.');
    addText('9.3.10. Fizer declarações inverídicas e/ou incompletas ou omitir circunstâncias capazes de influir na aceitação da proposta, na análise do risco, na estipulação do prêmio e/ ou na análise das circunstâncias do sinistro.');
    addText('9.3.11. Houver condução/manobra do carro por pessoa não autorizada e/ou não habilitada.');
    addText('9.3.12. Acidentes ocorridos fora do território nacional.');
    addText('9.3.13. Danos ou prejuízos sofridos pelo condutor e/ou ocupantes do carro alugado.');
    addText('9.3.14. Indenização por Custos Operacionais devidos à Locadora.');
    addText('9.3.15. Lucros cessantes sofridos por terceiros.');
    addText('9.3.16. Acidentes decorrentes da inobservância das disposições legais, por exemplo, aqueles causados por lotação de passageiros, peso, acondicionamento ou transporte de carga ou objeto transportado.');
    addText('9.3.17. Despesas com reboque para distância superior a 100 quilômetros da agência de origem.');
    addText('9.3.18 Despesas decorrentes de apreensão do carro alugado.');
    addText('9.3.19. Despesas decorrentes da apropriação indébita do carro alugado.');
    addText('9.3.20. Serviços profissionais de advogados e/ou despachantes.');
    addText('9.3.21. Extravio ou perda das chaves e documentos do carro.');
    addEmptyLine();
    addText('9.4. Além dos casos previstos na Apólice, o Cliente não terá direito à cobertura securitária se:');
    addText('9.4.1. Agir com Culpa Grave ou Uso Inadequado do carro.');
    addText('9.4.2. Utilizar o carro para fim diverso do indicado na Apólice ou Contrato.');
    addText('9.4.3. Deixar de cumprir as Condições Gerais do Seguro de Responsabilidade Civil.');
    addText('9.4.4. Deixar de comunicar imediatamente o Locador ou à Seguradora a existência de reclamação ou ação judicial que envolva qualquer risco coberto pela Apólice.');
    addText('9.4.5. Realizar acordo com terceiros sem anuência formal da Locadora/Seguradora.');
    addText('9.4.6. Deixar de comparecer às audiências em que for convocado, não elaborar sua defesa nos prazos legais e/ou não se fizer representar em processo judicial.');
    addText('9.4.7. O sinistro ocorrer após furto do carro alugado, quando não forem devolvidos à Locadora as chaves e os documentos do carro.');
    addEmptyLine();
    addText('CLAUSULA DECIMA - RESCISÃO', true);
    addText('10.1. O Contrato será considerado automaticamente rescindido pela Locadora, independentemente de qualquer notificação e esta, sem mais formalidades, providenciará a retomada do carro, sem que isso enseje ao Cliente qualquer direito de retenção ou indenização, quando:');
    addText('10.1.1. O carro não for devolvido na data, hora e agência previamente ajustadas.');
    addText('10.1.2. Ocorrer qualquer acidente ou dano envolvendo o carro alugado, causado dolosa ou culposamente pelo Cliente.');
    addText('10.1.3. Ocorrer o Uso Inadequado do carro.');
    addText('10.1.4. Ocorrer apreensão do carro alugado por autoridades competentes.');
    addText('10.1.5. O Cliente não quitar seus débitos nos respectivos vencimentos.');
    addText('10.1.6 Caso ocorra rescisão do contrato por parte do LOCATARIO antes do prazo estipulado será aplicado multa de 50% sobre o valor dos dias a vencer abatidos do valor da caução na devolução ao LOCATARIO observadas possíveis avarias no carro.', true, 10, 1);
    addEmptyLine();
    addText('CLAUSULA DECIMA PRIMEIRA - DISPOSIÇÕES GERAIS', true);
    addText('11.1. O LOCADOR concorda que a sua assinatura no Contrato implica ciência e adesão por si, seus herdeiros/sucessores a estas Condições Gerais, desde que respeitados os artigos 46 e 47 da Lei nº 8.078/90.');
    addText('11.2. Eventual omissão ou atraso de qualquer das Partes em exigir o cumprimento de qualquer condição do Contrato ou em exercer qualquer direito não constituirá novação, nem implicará renúncia da possibilidade futura de exigir seu cumprimento.');
    addText('11.3. O Contrato formalizado entre as Partes substitui quaisquer acordos anteriores.');
    addText('11.4. A Locadora não se responsabiliza por objetos/valores deixados no carro ou em suas dependências.');
    addEmptyLine();
    addText('CLAUSULA DECIMA SEGUNDA - DO FORO', true);
    addText('12.1 Para dirimir quaisquer controvérsias oriundas do CONTRATO, as partes elegem o foro da comarca de Serra;');
    addEmptyLine();

    // Assinaturas
       addText('Por estarem assim justos e contratados, firmam o presente instrumento, em duas vias de igual teor, juntamente com 2 (duas) testemunhas.');
    addEmptyLine();


    // Data formatada por extenso
    const dataExtenso = new Date(contractToPdf.data_criacao).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    addText(`Serra, ${dataExtenso}.`);
    addEmptyLine();

    const addSignatures = () => {

      const pageHeight = doc.internal.pageSize.getHeight();
      const signatureY = pageHeight - 70; // posição fixa do bloco de assinaturas 
      

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      // Linhas de assinatura
      doc.text('________________________________', margin, signatureY + 10);
      doc.text('________________________________', margin + 100, signatureY + 10);

      // Nomes.
      doc.setFontSize(8);
      doc.text(`${clientContract.nome}`, margin + 0.5, signatureY + 14);
      doc.text('ERIDELSON DIAS MOREIRA', margin + 100.5, signatureY + 14);

      // Títulos
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text('LOCATÁRIO', margin + 0.5, signatureY + 18);
      doc.text('LOCADOR', margin + 100.5, signatureY + 18);

      // Testemunhas
      const witnessY = signatureY + 30;
      doc.text('TESTEMUNHAS:', margin + 72, witnessY);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('_________________________________', margin, witnessY + 10);
      doc.text('_________________________________', margin + 100, witnessY + 10);
      
      doc.text('', margin, witnessY);
      doc.setFontSize(8);
      doc.text('AILANDIA REGINA INFURNA MOREIRA', margin + 108, witnessY + 14);

      doc.text('CPF: ___________________', margin + 6, witnessY + 18);
      doc.text('CPF: 093.504.867-76', margin + 120, witnessY + 18);
    }

    addSignatures()                 		                                                           
    
    // doc.save(`Contrato_Locação_${clientContract.nome}_${vehicleContract.placa}.pdf`);
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar o contrato em PDF.');
  }
  
}