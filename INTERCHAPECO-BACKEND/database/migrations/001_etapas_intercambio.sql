BEGIN;

CREATE TABLE public.etapas_intercambio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR NOT NULL UNIQUE,
    ordem INTEGER NOT NULL UNIQUE CHECK (ordem > 0)
);

ALTER TABLE public.etapas_intercambio
ENABLE ROW LEVEL SECURITY;

INSERT INTO public.etapas_intercambio (nome, ordem)
VALUES
    ('Antes', 1),
    ('Chegada', 2),
    ('Durante', 3),
    ('Retorno', 4);

ALTER TABLE public.tarefas
ADD COLUMN etapa_id UUID;

ALTER TABLE public.tarefas
ADD CONSTRAINT fk_tarefa_etapa
FOREIGN KEY (etapa_id)
REFERENCES public.etapas_intercambio(id);

ALTER TABLE public.tarefas
ALTER COLUMN etapa_id SET NOT NULL;

COMMIT;