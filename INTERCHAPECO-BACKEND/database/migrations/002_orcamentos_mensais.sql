BEGIN;

CREATE TABLE public.orcamentos_mensais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL,
    ano INTEGER NOT NULL,
    mes INTEGER NOT NULL,
    valor NUMERIC(12,2) NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_orcamento_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES public.usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_orcamento_usuario_periodo
        UNIQUE (usuario_id, ano, mes),

    CONSTRAINT chk_orcamento_ano
        CHECK (ano BETWEEN 2000 AND 9999),

    CONSTRAINT chk_orcamento_mes
        CHECK (mes BETWEEN 1 AND 12),

    CONSTRAINT chk_orcamento_valor
        CHECK (valor > 0)
);

ALTER TABLE public.orcamentos_mensais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gastos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias_gasto ENABLE ROW LEVEL SECURITY;

COMMIT;