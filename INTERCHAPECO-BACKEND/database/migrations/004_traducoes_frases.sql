-- InterChapecó — Traduções das 71 frases existentes
-- Mantém IDs, favoritos e conteúdo original. Executar no SQL Editor.
BEGIN;
ALTER TABLE public.frases
  ADD COLUMN IF NOT EXISTS traducao_ingles varchar(300),
  ADD COLUMN IF NOT EXISTS explicacao_ingles text,
  ADD COLUMN IF NOT EXISTS explicacao_portugues text;

CREATE TEMP TABLE frases_traducoes_31 (
  id uuid PRIMARY KEY, frase_portugues text, traducao_espanhol text,
  explicacao text, traducao_ingles text, explicacao_ingles text,
  explicacao_portugues text
) ON COMMIT DROP;
INSERT INTO frases_traducoes_31 VALUES
  ('3c69253c-9224-4a88-b594-58fc3db85c9a'::uuid, 'A conta, por favor.', 'La cuenta, por favor.', 'Para solicitar el pago después de comer.', 'The bill, please.', 'To ask for the bill after eating.', 'Para pedir a conta depois de comer.'),
  ('64b4f090-aca6-4ba5-adb4-683858d266fd'::uuid, 'Até amanhã!', '¡Hasta mañana!', 'Para despedirte de alguien que verás al día siguiente.', 'See you tomorrow!', 'To say goodbye to someone you will see the next day.', 'Para se despedir de alguém que você verá no dia seguinte.'),
  ('e1964ae6-24d9-4b5e-a612-012e7b3225b7'::uuid, 'Boa noite!', '¡Buenas noches!', 'Saludo o despedida utilizado durante la noche.', 'Good evening! / Good night!', 'A greeting or farewell used at night.', 'Saudação ou despedida usada à noite.'),
  ('e7d30f43-e85c-42b7-b30c-b337cae96e1f'::uuid, 'Boa tarde!', '¡Buenas tardes!', 'Saludo utilizado durante la tarde.', 'Good afternoon!', 'A greeting used in the afternoon.', 'Saudação usada durante a tarde.'),
  ('b2a842c1-0efa-475a-9e8f-2220096dd140'::uuid, 'Bom dia!', '¡Buenos días!', 'Saludo utilizado durante la mañana.', 'Good morning!', 'A greeting used in the morning.', 'Saudação usada durante a manhã.'),
  ('d647671b-2138-4cf6-a996-6915e16d008b'::uuid, 'Chame uma ambulância!', '¡Llame a una ambulancia!', 'Cuando alguien necesita atención médica urgente.', 'Call an ambulance!', 'When someone needs urgent medical attention.', 'Quando alguém precisa de atendimento médico urgente.'),
  ('b8ff6956-1fb4-4660-888a-02b7e04fb0d9'::uuid, 'Com licença.', 'Con permiso.', 'Para pasar entre personas o llamar su atención educadamente.', 'Excuse me.', 'To pass between people or politely get their attention.', 'Para passar entre pessoas ou chamar a atenção delas educadamente.'),
  ('607d8e76-3690-4f17-9275-bae9779c7a01'::uuid, 'Como se diz isso em português?', '¿Cómo se dice eso en portugués?', 'Para aprender nuevas palabras o expresiones.', 'How do you say that in Portuguese?', 'To learn new words or expressions.', 'Para aprender novas palavras ou expressões.'),
  ('fd2815d2-4b94-4abc-bf04-4396f7437c00'::uuid, 'Dá para ir a pé?', '¿Se puede ir caminando?', 'Para saber si un destino es accesible a pie.', 'Can I walk there?', 'To find out whether a destination is accessible on foot.', 'Para saber se um destino é acessível a pé.'),
  ('b22a0276-98a0-4d35-82f0-a3779f199b18'::uuid, 'De nada!', '¡De nada!', 'Respuesta habitual cuando alguien agradece.', 'You''re welcome!', 'A common response when someone thanks you.', 'Resposta habitual quando alguém agradece.'),
  ('9f9f2fb4-4c7b-4422-9e49-c231e351b8eb'::uuid, 'É para viagem.', 'Es para llevar.', 'Para indicar que llevarás la comida a otro lugar.', 'It''s to go.', 'To indicate that you will take the food somewhere else.', 'Para indicar que você levará a comida para outro lugar.'),
  ('ef744e7c-390f-4448-81b9-9a3dd6d58bcc'::uuid, 'Estava muito gostoso!', '¡Estaba muy rico!', 'Para expresar que disfrutaste la comida.', 'It was delicious!', 'To express that you enjoyed the food.', 'Para expressar que você gostou da comida.'),
  ('81a46103-7973-4a51-8a0e-c536d0380e9b'::uuid, 'Este ônibus vai para o centro?', '¿Este autobús va al centro?', 'Para confirmar el destino de una ruta.', 'Does this bus go downtown?', 'To confirm the destination of a bus route.', 'Para confirmar o destino de uma linha de ônibus.'),
  ('3b83deb2-003a-4471-8cca-94629ce8106d'::uuid, 'Estou aprendendo português.', 'Estoy aprendiendo portugués.', 'Para explicar que todavía estás aprendiendo el idioma.', 'I''m learning Portuguese.', 'To explain that you are still learning the language.', 'Para explicar que você ainda está aprendendo o idioma.'),
  ('c78c0003-177c-4b05-9912-a588d81854f1'::uuid, 'Estou com muita dor.', 'Tengo mucho dolor.', 'Para comunicar un dolor intenso.', 'I''m in a lot of pain.', 'To communicate severe pain.', 'Para comunicar uma dor intensa.'),
  ('2691c9be-b172-4385-b1eb-88752e9ee786'::uuid, 'Estou perdido.', 'Estoy perdido.', 'Cuando no sabes dónde estás o cómo regresar.', 'I''m lost.', 'When you do not know where you are or how to get back.', 'Quando você não sabe onde está ou como voltar.'),
  ('676a6c29-8e92-42d0-bbeb-8ba219480c10'::uuid, 'Estou só olhando, obrigado.', 'Solo estoy mirando, gracias.', 'Cuando un vendedor ofrece ayuda y todavía no deseas comprar.', 'I''m just looking, thank you.', 'When a salesperson offers help and you do not want to buy anything yet.', 'Quando um vendedor oferece ajuda e você ainda não deseja comprar.'),
  ('4a12ecdf-2dd6-4bac-bfdf-500618136933'::uuid, 'Eu gostaria de fazer um pedido.', 'Me gustaría hacer un pedido.', 'Para indicar que estás listo para ordenar.', 'I''d like to place an order.', 'To indicate that you are ready to order.', 'Para indicar que você está pronto para fazer o pedido.'),
  ('3323249b-2568-46ef-990c-7e36a4ac8222'::uuid, 'Muito obrigado!', '¡Muchas gracias!', 'Para agradecer. Las mujeres suelen utilizar obrigada.', 'Thank you very much!', 'To express gratitude. Women usually say obrigada in Portuguese.', 'Para agradecer. Mulheres geralmente usam obrigada.'),
  ('839ce05a-c06f-4ab9-9370-8a0bbf0246f1'::uuid, 'Não entendi.', 'No entendí.', 'Cuando no comprendes algo que te han dicho.', 'I didn''t understand.', 'When you do not understand something someone has said.', 'Quando você não entende algo que alguém disse.'),
  ('e4e623cd-61fe-4b61-b57b-240d8a1b67dd'::uuid, 'Não estou me sentindo bem.', 'No me siento bien.', 'Para informar que tienes algún malestar físico.', 'I''m not feeling well.', 'To report that you are feeling physically unwell.', 'Para informar que você está sentindo algum mal-estar físico.'),
  ('2c786f21-5cd6-4ae6-922d-c74ffd4a54d3'::uuid, 'Não tem problema.', 'No hay problema.', 'Para indicar que una situación no genera inconvenientes.', 'No problem.', 'To indicate that a situation does not cause any inconvenience.', 'Para indicar que uma situação não gera inconvenientes.'),
  ('cbd74914-8ab2-4a82-8a31-436b64b2bcfa'::uuid, 'O trabalho é individual ou em grupo?', '¿El trabajo es individual o en grupo?', 'Para consultar la modalidad de una actividad.', 'Is the assignment individual or group work?', 'To ask about the format of an academic activity.', 'Para consultar a modalidade de uma atividade acadêmica.'),
  ('5a468c1f-c0da-4a84-9d94-480b73ecd3dc'::uuid, 'Oi, tudo bem?', 'Hola, ¿todo bien?', 'Saludo informal muy común en Brasil.', 'Hi, how are you?', 'A very common informal greeting in Brazil.', 'Saudação informal muito comum no Brasil.'),
  ('9ad21175-2d38-4a36-b964-74c6bbba9b24'::uuid, 'Onde devo descer?', '¿Dónde debo bajarme?', 'Para identificar la parada correspondiente a tu destino.', 'Where should I get off?', 'To identify the stop corresponding to your destination.', 'Para identificar a parada correspondente ao seu destino.'),
  ('a1599655-8839-4fbe-83d5-fe6abb0e8d20'::uuid, 'Onde fica a rodoviária?', '¿Dónde queda la terminal de autobuses?', 'Para localizar la terminal de transporte intermunicipal.', 'Where is the bus terminal?', 'To locate the intercity bus terminal.', 'Para localizar o terminal de transporte intermunicipal.'),
  ('db50a2f7-7713-44ae-b00d-6d3d2f8b4660'::uuid, 'Onde fica esta sala?', '¿Dónde queda este salón?', 'Para encontrar un aula dentro de la universidad.', 'Where is this classroom?', 'To find a classroom at the university.', 'Para encontrar uma sala de aula na universidade.'),
  ('50142c45-0036-4b91-9753-223f16f959a7'::uuid, 'Onde fica o banheiro?', '¿Dónde queda el baño?', 'Para localizar un baño en un establecimiento.', 'Where is the restroom?', 'To locate a restroom in an establishment.', 'Para localizar um banheiro em um estabelecimento.'),
  ('46072365-dbea-4804-b642-bf3ae3451903'::uuid, 'Onde fica o caixa?', '¿Dónde queda la caja?', 'Para localizar el lugar donde se realiza el pago.', 'Where is the checkout?', 'To locate the place where you pay.', 'Para localizar o lugar onde se realiza o pagamento.'),
  ('fa351eab-5d41-491a-9e6b-0f791c17b393'::uuid, 'Onde fica o hospital mais próximo?', '¿Dónde queda el hospital más cercano?', 'Para localizar un centro de atención médica.', 'Where is the nearest hospital?', 'To locate a medical care facility.', 'Para localizar um centro de atendimento médico.'),
  ('01a014f7-6fab-418f-bd19-7855eec71b8e'::uuid, 'Onde fica o ponto de ônibus?', '¿Dónde queda la parada de autobús?', 'Para encontrar una parada de transporte público.', 'Where is the bus stop?', 'To find a public transport stop.', 'Para encontrar uma parada de transporte público.'),
  ('73930ebf-f2d5-43ca-aa84-04036387ba5c'::uuid, 'Onde posso acessar o material da aula?', '¿Dónde puedo acceder al material de la clase?', 'Para encontrar los recursos académicos de una asignatura.', 'Where can I access the class materials?', 'To find academic resources for a course.', 'Para encontrar os recursos acadêmicos de uma disciplina.'),
  ('866e5335-d2e3-4b97-90b3-30e650d27e43'::uuid, 'Perdi meu passaporte.', 'Perdí mi pasaporte.', 'Para informar la pérdida de un documento importante.', 'I''ve lost my passport.', 'To report the loss of an important document.', 'Para informar a perda de um documento importante.'),
  ('39f19060-f6d4-4ed7-81e9-2df18b7c2e8e'::uuid, 'Pode explicar novamente?', '¿Puede explicar nuevamente?', 'Cuando necesitas que el profesor repita una explicación.', 'Could you explain that again?', 'When you need the teacher to repeat an explanation.', 'Quando você precisa que o professor repita uma explicação.'),
  ('a18ab85b-ff63-47f2-97a9-a60aa0bad77d'::uuid, 'Pode falar mais devagar?', '¿Puede hablar más despacio?', 'Cuando una persona habla demasiado rápido.', 'Could you speak more slowly?', 'When someone is speaking too quickly.', 'Quando uma pessoa fala rápido demais.'),
  ('a2bf2a38-4d5e-484b-8c03-7cad577fa498'::uuid, 'Pode me ajudar?', '¿Me puede ayudar?', 'Para solicitar ayuda en situaciones cotidianas.', 'Can you help me?', 'To ask for help in everyday situations.', 'Para solicitar ajuda em situações cotidianas.'),
  ('48b7fe63-01d7-4377-a365-c219d62b6e0d'::uuid, 'Pode me dar uma sacola?', '¿Me puede dar una bolsa?', 'Para solicitar una bolsa después de comprar.', 'Could I have a bag?', 'To ask for a bag after shopping.', 'Para solicitar uma sacola após fazer compras.'),
  ('97851fc6-678a-4ad6-ba8d-9e2e86fc3434'::uuid, 'Pode parar aqui, por favor?', '¿Puede parar aquí, por favor?', 'Para solicitar una parada durante un viaje en automóvil.', 'Could you stop here, please?', 'To request a stop during a car journey.', 'Para solicitar uma parada durante uma viagem de carro.'),
  ('1c823cb9-9245-48af-b6ea-f2dd3603a626'::uuid, 'Pode repetir, por favor?', '¿Puede repetir, por favor?', 'Para pedir que repitan una información.', 'Could you repeat that, please?', 'To ask someone to repeat information.', 'Para pedir que repitam uma informação.'),
  ('b88e295b-4370-404e-8367-522e47bab481'::uuid, 'Podemos dividir a conta?', '¿Podemos dividir la cuenta?', 'Cuando varias personas desean pagar por separado o repartir el total.', 'Can we split the bill?', 'When several people want to pay separately or share the total.', 'Quando várias pessoas desejam pagar separadamente ou dividir o total.'),
  ('84496138-c730-4e8b-b7ab-1f8533c96e54'::uuid, 'Posso entregar o trabalho depois?', '¿Puedo entregar el trabajo después?', 'Para solicitar un plazo adicional al profesor.', 'Can I submit the assignment later?', 'To ask the teacher for an extension.', 'Para solicitar um prazo adicional ao professor.'),
  ('2130152a-4462-4b0b-92e1-81ffcaa95571'::uuid, 'Posso experimentar?', '¿Me lo puedo probar?', 'Para solicitar permiso para probarse una prenda.', 'Can I try it on?', 'To ask for permission to try on a piece of clothing.', 'Para pedir permissão para experimentar uma peça de roupa.'),
  ('acf03721-9f6a-4e61-aad3-1a740ebf36b2'::uuid, 'Posso pagar com Pix?', '¿Puedo pagar con Pix?', 'Para preguntar si aceptan el sistema de pagos instantáneos de Brasil.', 'Can I pay with Pix?', 'To ask whether Brazil''s instant payment system is accepted.', 'Para perguntar se aceitam o sistema brasileiro de pagamentos instantâneos.'),
  ('afccb63d-dfe5-4abe-8fca-7d7255906cfb'::uuid, 'Posso ver o cardápio?', '¿Puedo ver el menú?', 'Para solicitar la carta de alimentos y bebidas.', 'May I see the menu?', 'To ask for the food and drinks menu.', 'Para solicitar o cardápio de alimentos e bebidas.'),
  ('19fe7eaf-187b-4cb2-af74-44117e0e427e'::uuid, 'Prazer em conhecer você.', 'Mucho gusto en conocerte.', 'Cuando conoces a una persona por primera vez.', 'Nice to meet you.', 'When meeting someone for the first time.', 'Quando você conhece uma pessoa pela primeira vez.'),
  ('70078697-f134-408d-a059-d1752a7e8ea5'::uuid, 'Preciso de ajuda!', '¡Necesito ayuda!', 'Para solicitar ayuda de manera urgente.', 'I need help!', 'To urgently ask for help.', 'Para solicitar ajuda com urgência.'),
  ('c7141e72-eab3-4e40-83e6-8f1a7976b0a6'::uuid, 'Preciso falar com a polícia.', 'Necesito hablar con la policía.', 'Para solicitar atención de las autoridades.', 'I need to speak to the police.', 'To request assistance from the authorities.', 'Para solicitar atendimento das autoridades.'),
  ('de8e5360-1834-496a-8316-35ea219e87d0'::uuid, 'Preciso falar com o professor.', 'Necesito hablar con el profesor.', 'Para solicitar una conversación con el docente.', 'I need to speak to the teacher.', 'To request a conversation with the teacher.', 'Para solicitar uma conversa com o professor.'),
  ('df20f34a-36d5-4da8-b8e9-7c776339dfba'::uuid, 'Preciso ir para este endereço.', 'Necesito ir a esta dirección.', 'Para indicar un destino a un conductor.', 'I need to go to this address.', 'To tell a driver your destination.', 'Para indicar um destino a um motorista.'),
  ('87f22176-e130-4fbb-9a00-be6641de9ec6'::uuid, 'Quais são os ingredientes?', '¿Cuáles son los ingredientes?', 'Para conocer los componentes de un plato.', 'What are the ingredients?', 'To find out what a dish contains.', 'Para conhecer os ingredientes de um prato.'),
  ('dc15f4b2-c7e7-4329-8d2e-b35c17e46b1f'::uuid, 'Qual é a data de entrega?', '¿Cuál es la fecha de entrega?', 'Para consultar el plazo de una actividad académica.', 'When is the due date?', 'To ask about the deadline for an academic activity.', 'Para consultar o prazo de uma atividade acadêmica.'),
  ('60ef7428-7d82-4041-a528-4bc27d53d949'::uuid, 'Qual é a senha do Wi-Fi?', '¿Cuál es la contraseña del Wi-Fi?', 'Para solicitar acceso a una red inalámbrica.', 'What''s the Wi-Fi password?', 'To request access to a wireless network.', 'Para solicitar acesso a uma rede sem fio.'),
  ('05f83390-fc3b-4ba1-b00f-699a59e9216f'::uuid, 'Qual é o horário da aula?', '¿Cuál es el horario de la clase?', 'Para consultar la hora de una actividad académica.', 'What time is the class?', 'To ask about the time of an academic activity.', 'Para consultar o horário de uma atividade acadêmica.'),
  ('05375062-57c9-43de-a793-ec667d35f9f9'::uuid, 'Qual é o prato do dia?', '¿Cuál es el plato del día?', 'Para preguntar por la comida especial del día.', 'What''s the dish of the day?', 'To ask about the daily special.', 'Para perguntar pelo prato especial do dia.'),
  ('87ab9af9-e825-4aa3-8728-b20a9ff61d7e'::uuid, 'Qual ônibus devo pegar?', '¿Qué autobús debo tomar?', 'Para solicitar orientación sobre las rutas disponibles.', 'Which bus should I take?', 'To ask for guidance on available bus routes.', 'Para solicitar orientação sobre as linhas de ônibus disponíveis.'),
  ('9a13b1f4-2414-453d-9a4c-abdc39195d53'::uuid, 'Quando será a prova?', '¿Cuándo será el examen?', 'Para consultar la fecha de una evaluación.', 'When is the exam?', 'To ask about the date of an assessment.', 'Para consultar a data de uma avaliação.'),
  ('2d8b67d9-7cea-4cd6-8e67-b737ade29516'::uuid, 'Quanto custa a passagem?', '¿Cuánto cuesta el pasaje?', 'Para consultar el precio de un viaje.', 'How much is the fare?', 'To ask about the cost of a journey.', 'Para consultar o preço de uma viagem.'),
  ('e26bfab4-4bad-4c9c-afe8-cbbeb5d38c36'::uuid, 'Quanto custa?', '¿Cuánto cuesta?', 'Para preguntar el precio de un producto.', 'How much does it cost?', 'To ask the price of a product.', 'Para perguntar o preço de um produto.'),
  ('2537a70b-e4a5-4876-90aa-859506337662'::uuid, 'Quanto tempo demora?', '¿Cuánto tiempo tarda?', 'Para preguntar por la duración de un trayecto.', 'How long does it take?', 'To ask about the duration of a journey.', 'Para perguntar sobre a duração de um trajeto.'),
  ('d9542b42-c01f-4257-ae14-c4b81c02e999'::uuid, 'Que horas são?', '¿Qué hora es?', 'Para preguntar la hora actual.', 'What time is it?', 'To ask for the current time.', 'Para perguntar a hora atual.'),
  ('3e9fc1d2-22d3-4a3a-9aa4-9ba73782afc5'::uuid, 'Roubaram meu celular.', 'Me robaron el celular.', 'Para comunicar el robo de un teléfono.', 'My phone was stolen.', 'To report the theft of a phone.', 'Para comunicar o roubo de um celular.'),
  ('24ed1c4f-ebff-435b-8575-63983d26be72'::uuid, 'Sou estudante de intercâmbio.', 'Soy estudiante de intercambio.', 'Para presentarte ante profesores y compañeros.', 'I''m an exchange student.', 'To introduce yourself to teachers and classmates.', 'Para se apresentar a professores e colegas.'),
  ('acba197f-c859-4076-b219-7f993b84bde2'::uuid, 'Tem desconto?', '¿Tiene descuento?', 'Para consultar si existe alguna promoción.', 'Is there a discount?', 'To ask whether there is a special offer.', 'Para consultar se existe alguma promoção.'),
  ('7eedd1f5-c912-4a1c-8914-64dc9285d202'::uuid, 'Tem opção vegetariana?', '¿Tiene opción vegetariana?', 'Para consultar si existen platos sin carne ni pescado.', 'Is there a vegetarian option?', 'To ask whether there are dishes without meat or fish.', 'Para consultar se existem pratos sem carne nem peixe.'),
  ('d686e5bb-b8b5-4fe4-808e-73cb63cb1c6d'::uuid, 'Tem um tamanho maior?', '¿Tiene una talla más grande?', 'Cuando una prenda no es de tu talla.', 'Do you have a larger size?', 'When a piece of clothing is not your size.', 'Quando uma peça de roupa não é do seu tamanho.'),
  ('36905a4d-8ccc-45a5-be26-c5bac5a36b04'::uuid, 'Tem um tamanho menor?', '¿Tiene una talla más pequeña?', 'Cuando necesitas una prenda más pequeña.', 'Do you have a smaller size?', 'When you need a smaller piece of clothing.', 'Quando você precisa de uma peça de roupa menor.'),
  ('d8552e88-f185-433f-abcb-b3cb05ee1411'::uuid, 'Tenho alergia a este medicamento.', 'Soy alérgico a este medicamento.', 'Para informar una alergia durante una atención médica.', 'I''m allergic to this medication.', 'To report an allergy during medical care.', 'Para informar uma alergia durante um atendimento médico.'),
  ('3d2856a9-abb8-48c2-ac65-19652c89605d'::uuid, 'Tudo bem, e você?', 'Todo bien, ¿y tú?', 'Respuesta habitual a un saludo informal.', 'I''m fine, and you?', 'A common response to an informal greeting.', 'Resposta habitual a uma saudação informal.'),
  ('4971473c-07d7-4c30-96cb-099a78d66c39'::uuid, 'Tudo bem, e você?', 'Todo bien, ¿y tú?', 'Saludando a una persona', 'I''m fine, and you?', 'When greeting someone.', 'Ao cumprimentar uma pessoa.'),
  ('a135f1aa-1404-459a-b1a1-286475e88202'::uuid, 'Uma água sem gás, por favor.', 'Un agua sin gas, por favor.', 'Para pedir agua sin gas.', 'Still water, please.', 'To ask for non-carbonated water.', 'Para pedir água sem gás.'),
  ('983345da-ac4d-41bb-95b5-71f8f42f6055'::uuid, 'Vocês aceitam cartão?', '¿Aceptan tarjeta?', 'Para consultar los métodos de pago disponibles.', 'Do you accept cards?', 'To ask about available payment methods.', 'Para consultar os métodos de pagamento disponíveis.');

-- Cancela a transação se algum registro original tiver mudado.
DO $$
BEGIN
  IF (SELECT count(*) FROM public.frases f JOIN frases_traducoes_31 t
      ON f.id = t.id AND f.frase_portugues IS NOT DISTINCT FROM t.frase_portugues
      AND f.traducao_espanhol IS NOT DISTINCT FROM t.traducao_espanhol
      AND f.explicacao IS NOT DISTINCT FROM t.explicacao) <> 71 THEN
    RAISE EXCEPTION 'Os registros originais mudaram; revise antes de atualizar.';
  END IF;
END $$;

UPDATE public.frases f SET
  traducao_ingles = COALESCE(NULLIF(btrim(f.traducao_ingles), ''), t.traducao_ingles),
  explicacao_ingles = COALESCE(NULLIF(btrim(f.explicacao_ingles), ''), t.explicacao_ingles),
  explicacao_portugues = COALESCE(NULLIF(btrim(f.explicacao_portugues), ''), t.explicacao_portugues)
FROM frases_traducoes_31 t WHERE f.id = t.id;
COMMIT;

SELECT count(*) AS total_frases,
  count(*) FILTER (WHERE NULLIF(btrim(traducao_ingles), '') IS NOT NULL
    AND NULLIF(btrim(explicacao_ingles), '') IS NOT NULL
    AND NULLIF(btrim(explicacao_portugues), '') IS NOT NULL) AS traduzidas
FROM public.frases;
