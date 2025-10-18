import { pgTable, uuid, varchar, text, timestamp, boolean, integer, decimal, jsonb, inet, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const admins = pgTable('admins', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: varchar('email', { length: 255 }).notNull().unique(),
  nome: varchar('nome', { length: 255 }).notNull(),
  senha: varchar('senha', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('idx_admins_email').on(table.email),
}));

export const empresas = pgTable('empresas', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  nomeEmpresa: varchar('nome_empresa', { length: 255 }).notNull(),
  emailContato: varchar('email_contato', { length: 255 }).notNull().unique(),
  senha: varchar('senha', { length: 255 }).notNull(),
  adminId: uuid('admin_id').references(() => admins.id),
  configuracoes: jsonb('configuracoes').default({}),
  ativa: boolean('ativa').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  adminIdx: index('idx_empresas_admin_id').on(table.adminId),
  emailIdx: index('idx_empresas_email').on(table.emailContato),
  ativaIdx: index('idx_empresas_ativa').on(table.ativa),
}));

export const colaboradores = pgTable('colaboradores', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  nome: varchar('nome', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  senha: varchar('senha', { length: 255 }).notNull(),
  cargo: varchar('cargo', { length: 255 }),
  departamento: varchar('departamento', { length: 255 }),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }),
  permissoes: jsonb('permissoes').default({}),
  ativo: boolean('ativo').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  empresaIdx: index('idx_colaboradores_empresa_id').on(table.empresaId),
  emailIdx: index('idx_colaboradores_email').on(table.email),
  ativoIdx: index('idx_colaboradores_ativo').on(table.ativo),
}));

export const testes = pgTable('testes', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  nome: varchar('nome', { length: 255 }).notNull(),
  descricao: text('descricao'),
  categoria: varchar('categoria', { length: 100 }),
  tempoEstimado: integer('tempo_estimado'),
  instrucoes: text('instrucoes'),
  ativo: boolean('ativo').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  nomeIdx: index('idx_testes_nome').on(table.nome),
  categoriaIdx: index('idx_testes_categoria').on(table.categoria),
}));

export const resultados = pgTable('resultados', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  testeId: uuid('teste_id').references(() => testes.id, { onDelete: 'cascade' }).notNull(),
  usuarioId: uuid('usuario_id'),
  pontuacaoTotal: integer('pontuacao_total'),
  tempoGasto: integer('tempo_gasto'),
  dataRealizacao: timestamp('data_realizacao', { withTimezone: true }).defaultNow().notNull(),
  status: varchar('status', { length: 50 }).default('concluido').notNull(),
  metadados: jsonb('metadados'),
  sessionId: varchar('session_id', { length: 255 }),
  userAgent: text('user_agent'),
  ipAddress: inet('ip_address'),
  colaboradorId: uuid('colaborador_id').references(() => colaboradores.id),
  empresaId: uuid('empresa_id').references(() => empresas.id),
  userEmail: varchar('user_email', { length: 255 }),
}, (table) => ({
  testeIdx: index('idx_resultados_teste_id').on(table.testeId),
  usuarioDataIdx: index('idx_resultados_usuario_data').on(table.usuarioId, table.dataRealizacao),
  statusIdx: index('idx_resultados_status').on(table.status),
}));

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;

export type Empresa = typeof empresas.$inferSelect;
export type InsertEmpresa = z.infer<typeof insertEmpresaSchema>;

export type Colaborador = typeof colaboradores.$inferSelect;
export type InsertColaborador = z.infer<typeof insertColaboradorSchema>;

export type Teste = typeof testes.$inferSelect;
export type InsertTeste = z.infer<typeof insertTesteSchema>;

export type Resultado = typeof resultados.$inferSelect;
export type InsertResultado = z.infer<typeof insertResultadoSchema>;

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmpresaSchema = createInsertSchema(empresas).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertColaboradorSchema = createInsertSchema(colaboradores).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTesteSchema = createInsertSchema(testes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertResultadoSchema = createInsertSchema(resultados).omit({
  id: true,
  dataRealizacao: true,
});

export const convitesEmpresa = pgTable('convites_empresa', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  token: varchar('token', { length: 255 }).notNull().unique(),
  nomeEmpresa: varchar('nome_empresa', { length: 255 }).notNull(),
  emailContato: varchar('email_contato', { length: 255 }).notNull(),
  adminId: uuid('admin_id').references(() => admins.id),
  validade: timestamp('validade', { withTimezone: true }).notNull(),
  status: varchar('status', { length: 50 }).default('pendente').notNull(),
  metadados: jsonb('metadados').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  tokenIdx: index('idx_convites_empresa_token').on(table.token),
  statusIdx: index('idx_convites_empresa_status').on(table.status),
  validadeIdx: index('idx_convites_empresa_validade').on(table.validade),
}));

export const convitesColaborador = pgTable('convites_colaborador', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  token: varchar('token', { length: 255 }).notNull().unique(),
  nome: varchar('nome', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  cargo: varchar('cargo', { length: 255 }),
  departamento: varchar('departamento', { length: 255 }),
  empresaId: uuid('empresa_id').references(() => empresas.id, { onDelete: 'cascade' }),
  validade: timestamp('validade', { withTimezone: true }).notNull(),
  status: varchar('status', { length: 50 }).default('pendente').notNull(),
  metadados: jsonb('metadados').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  tokenIdx: index('idx_convites_colaborador_token').on(table.token),
  empresaIdx: index('idx_convites_colaborador_empresa_id').on(table.empresaId),
  statusIdx: index('idx_convites_colaborador_status').on(table.status),
}));

export const perguntas = pgTable('perguntas', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  testeId: uuid('teste_id').references(() => testes.id, { onDelete: 'cascade' }).notNull(),
  texto: text('texto').notNull(),
  tipo: varchar('tipo', { length: 50 }).notNull(),
  opcoes: jsonb('opcoes'),
  escalaMin: integer('escala_min'),
  escalaMax: integer('escala_max'),
  obrigatoria: boolean('obrigatoria').default(true),
  ordem: integer('ordem').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  testeIdx: index('idx_perguntas_teste_id').on(table.testeId),
}));

export const respostas = pgTable('respostas', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  resultadoId: uuid('resultado_id').references(() => resultados.id, { onDelete: 'cascade' }).notNull(),
  perguntaId: uuid('pergunta_id').references(() => perguntas.id, { onDelete: 'cascade' }).notNull(),
  valor: text('valor').notNull(),
  pontuacao: integer('pontuacao'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  resultadoIdx: index('idx_respostas_resultado_id').on(table.resultadoId),
  perguntaIdx: index('idx_respostas_pergunta_id').on(table.perguntaId),
}));

export type ConviteEmpresa = typeof convitesEmpresa.$inferSelect;
export type InsertConviteEmpresa = z.infer<typeof insertConviteEmpresaSchema>;

export type ConviteColaborador = typeof convitesColaborador.$inferSelect;
export type InsertConviteColaborador = z.infer<typeof insertConviteColaboradorSchema>;

export type Pergunta = typeof perguntas.$inferSelect;
export type InsertPergunta = z.infer<typeof insertPerguntaSchema>;

export type Resposta = typeof respostas.$inferSelect;
export type InsertResposta = z.infer<typeof insertRespostaSchema>;

export const insertConviteEmpresaSchema = createInsertSchema(convitesEmpresa).omit({
  id: true,
  createdAt: true,
});

export const insertConviteColaboradorSchema = createInsertSchema(convitesColaborador).omit({
  id: true,
  createdAt: true,
});

export const insertPerguntaSchema = createInsertSchema(perguntas).omit({
  id: true,
  createdAt: true,
});

export const insertRespostaSchema = createInsertSchema(respostas).omit({
  id: true,
  createdAt: true,
});
