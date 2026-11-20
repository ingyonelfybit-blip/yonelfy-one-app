import { i as toModule } from './rolldown-runtime-Dd_uD5pT.js';
import { qt as reactModule, mt as localeContext, lt as addDaysIso, ut as date, ht as money, gt as number, xt as today, wt as useQuery, A as PageHeader, V as Button, C as Card, w as CardHeader, N as DateInput, E as EmptyState, D as ErrorState, P as Field, k as LoadingState, j as StatusBadge } from './design-system-64Q-iyWn.js';
import { f as supabase, o as useOrg, s as useOrgId, m as Link } from './index-DXwBgbGk.js';
import { w as unwrap } from './router-Dn-BK9cF.js';
import { i as useParam } from './filters-CvbpqnwJ.js';
const React = toModule(reactModule(), 1);
const { useState } = React;
const current = { get locale() { return localeContext().locale; } };
function percent(value, digits = 1) {
    if (value == null)
        return '—';
    const n = Number(value);
    if (!Number.isFinite(n))
        return '—';
    return new Intl.NumberFormat(current.locale, { style: 'percent', maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);
}
/** Minutes as "7 h 30 min". */
/**
 * Plain-language names for legal rule codes, for people reading a payslip or a trace (not for the engine).
 * The code stays available in tooltips and in the full trace ("¿Cómo se calculó?").
 */
const LABELS = {
    'DO.LABOR.JORNADA_PREMIUMS': 'Horas extra, nocturnas y feriados (Código de Trabajo)',
    'DO.LABOR.DAILY_DIVISOR': 'Salario diario (Código de Trabajo)',
    'DO.LABOR.SALARIO_NAVIDAD': 'Salario de Navidad',
    'DO.LABOR.VACACIONES': 'Vacaciones',
    'DO.LABOR.PREAVISO': 'Preaviso',
    'DO.LABOR.CESANTIA': 'Cesantía',
    'DO.LABOR.PARTICIPACION_BENEFICIOS': 'Participación en los beneficios',
    'DO.TSS.AFP.RATES': 'AFP (pensiones)',
    'DO.TSS.SFS.RATES': 'SFS (seguro de salud)',
    'DO.TSS.SFS.DEPENDIENTE_ADICIONAL': 'SFS por dependientes adicionales',
    'DO.TSS.SRL.RATES': 'Riesgos laborales (SRL)',
    'DO.TSS.CAPS': 'Topes de cotización de la TSS',
    'DO.INFOTEP.RATES': 'INFOTEP',
    'DO.ISR.SALARIED.SCALE': 'ISR (escala de la DGII)',
    'DO.ISR.SALARIED.MONTHLY_METHOD': 'ISR (retención mensual)',
    'DO.ISR.SFS_ADDITIONAL_DEDUCTION': 'Exención de ISR por dependientes adicionales del SFS',
    'DO.ISR.EXEMPT.REGALIA_PASCUAL': 'Exención de ISR del salario de Navidad',
    'DO.MINWAGE.PRIVATE_NON_SECTORIZED': 'Salario mínimo',
    'DO.MINWAGE.COMPANY_CLASSIFICATION': 'Clasificación de la empresa (salario mínimo)',
    'DO.MINWAGE.OTHER_CNS_01_2025': 'Salario mínimo de vigilantes, trabajadores del campo y jornada parcial',
    'DO.HOLIDAYS': 'Días feriados',
    'DO.LEAVE.ART54': 'Licencias remuneradas',
    'DO.LEAVE.MATERNITY': 'Licencia de maternidad',
};
/** "DO.INFOTEP.RATES" → "INFOTEP". Unknown codes fall back to a readable form of the code itself. */
export function legalLabel(code) {
    return LABELS[code] ?? 'Regla de cálculo';
}
/** One readable sentence listing the legal bases used by a set of payroll lines (deduplicated, in first-use order). */
export function legalBasisSentence(codes) {
    const labels = [...new Set(codes.filter((c) => Boolean(c)).map(legalLabel))];
    return labels.length ? `Calculado según: ${labels.join(' · ')}. El detalle de cada monto está disponible en HL Presencia.` : 'El detalle de cada monto está disponible en HL Presencia.';
}
const DOCUMENTED = new Set(['DO.MINWAGE.COMPANY_CLASSIFICATION', 'DO.MINWAGE.OTHER_CNS_01_2025']);
const STATUS = { verified: 'Verificada', unverified: 'Pendiente de verificación', draft: 'En preparación', retired: 'Archivada' };
const FIELDS = {
    employee_rate: 'Aporte del trabajador', employer_rate: 'Aporte del empleador', cap_sfs: 'Tope mensual de SFS', cap_afp: 'Tope mensual de AFP', cap_srl: 'Tope mensual de SRL',
    smn: 'Salario mínimo de referencia de la TSS', minimum_wage: 'Salario mínimo de referencia', annual_exemption: 'Exención anual', monthly_divisor: 'Divisor del salario mensual',
    per_dependent_monthly_health: 'Aporte mensual de salud', fonamat: 'Aporte al FONAMAT', per_dependent_monthly_total: 'Total mensual por dependiente',
    employer_total_rate_min: 'Tasa mínima patronal', employer_total_rate_max: 'Tasa máxima patronal', assigned_rate: 'Tasa asignada a la empresa',
    employer_rate_on_monthly_fixed_payroll: 'Aporte del empleador sobre nómina fija', employee_rate_on_profit_sharing: 'Aporte del trabajador sobre beneficios',
    max_weekly_hours: 'Jornada ordinaria semanal (horas)', overtime_premium_up_to_68h_week: 'Recargo de horas extra hasta 68 h/semana',
    overtime_premium_over_68h_week: 'Recargo de horas extra por encima de 68 h/semana', night_premium: 'Recargo nocturno', holiday_premium: 'Recargo en feriado',
    rest_day_premium: 'Recargo en descanso semanal', grande: 'Empresa grande', mediana: 'Empresa mediana', pequena: 'Empresa pequeña', micro: 'Microempresa',
    workers_min: 'Trabajadores desde', workers_max: 'Trabajadores hasta', sales_min: 'Ventas brutas anuales desde', sales_max: 'Ventas brutas anuales hasta',
    annual_gross_sales_gt: 'Ventas brutas anuales superiores a', amount: 'Importe', fixed_amount: 'Cuota fija', rate: 'Tasa', excess_over: 'Excedente sobre',
    from: 'Desde', to: 'Hasta', vigilantes_monthly: 'Vigilantes de empresas de guardianes privados (mensual)',
    trabajadores_campo_daily_8h: 'Trabajadores del campo (jornada de 8 horas)', part_time_max_hours_week: 'Límite semanal del régimen parcial (horas)',
    deductible: 'Deducible', deduct_confirmed_sfs: 'Exención por el aporte confirmado', from_years: 'Antigüedad desde (años)',
    days: 'Días', weeks: 'Semanas', percent: 'Porcentaje', maximum_days: 'Máximo de días', maximum_weeks: 'Máximo de semanas',
};
const AMOUNTS = /(^cap_|^per_dependent_|fonamat|^smn$|minimum_wage|^annual_exemption$|^sales_|annual_gross_sales|^amount$|^fixed_amount$|^excess_over$)/;
const RATIOS = /(?:^rate$|(?:^|_)rate(?:_|$)|_premium(?:_|$)|^percent$)/;
function labelValue(key, value, code) {
    if (value == null)
        return 'Sin límite';
    if (typeof value === 'boolean')
        return value ? 'Sí' : 'No';
    if (typeof value === 'number') {
        if (RATIOS.test(key))
            return percent(value);
        if (AMOUNTS.test(key) || (key === 'from' || key === 'to') || (['grande', 'mediana', 'pequena', 'micro'].includes(key) && code === 'DO.MINWAGE.PRIVATE_NON_SECTORIZED'))
            return money(value);
        return number(value, Number.isInteger(value) ? 0 : 2);
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(value))
        return date(value);
    return { DOP: 'Pesos dominicanos', annual: 'Anual', monthly: 'Mensual', employee: 'Trabajador', employer: 'Empleador' }[value] ?? null;
}
function RuleValues({ parameters, code }) {
    if (!parameters || typeof parameters !== 'object' || Array.isArray(parameters))
        return null;
    const entries = Object.entries(parameters);
    const labels = entries.flatMap(([key, value]) => {
        if (!FIELDS[key] || (value && typeof value === 'object'))
            return [];
        const formatted = labelValue(key, value, code);
        return formatted == null ? [] : [[FIELDS[key], formatted]];
    });
    return React.createElement("div", { className: "space-y-3" },
        labels.length > 0 && React.createElement("dl", { className: "divide-y divide-line rounded-md border border-line px-3 text-small" }, labels.map(([label, value]) => React.createElement("div", { key: label, className: "flex flex-wrap items-baseline justify-between gap-x-2 py-1.5" },
            React.createElement("dt", { className: "text-muted" }, label),
            React.createElement("dd", { className: "num font-medium" }, value)))),
        entries.map(([key, value]) => {
            if (key === 'holidays' && Array.isArray(value))
                return React.createElement("details", { key: key, className: "rounded-md border border-line p-3" },
                    React.createElement("summary", { className: "cursor-pointer text-small font-medium" },
                        "Ver calendario (",
                        value.length,
                        " feriados)"),
                    React.createElement("ul", { className: "mt-2 divide-y divide-line" }, value.map((holiday) => React.createElement("li", { key: holiday.actual_date, className: "flex flex-wrap gap-x-3 gap-y-1 py-2 text-small" },
                        React.createElement("b", { className: "num" }, date(holiday.observed_date)),
                        React.createElement("span", null, String(holiday.name).replace('Ano Nuevo', 'Año Nuevo')),
                        holiday.moved && React.createElement("span", { className: "text-muted" },
                            "Trasladado desde el ",
                            date(holiday.actual_date))))));
            if (key === 'brackets' && Array.isArray(value))
                return React.createElement("details", { key: key, className: "rounded-md border border-line p-3" },
                    React.createElement("summary", { className: "cursor-pointer text-small font-medium" }, "Ver tramos de la escala anual"),
                    React.createElement("ul", { className: "mt-2 divide-y divide-line" }, value.map((bracket) => React.createElement("li", { key: bracket.from, className: "flex flex-wrap justify-between gap-x-3 py-2 text-small" },
                        React.createElement("span", { className: "num" },
                            money(bracket.from),
                            " \u00B7 ",
                            bracket.to == null ? 'En adelante' : money(bracket.to)),
                        React.createElement("b", null, bracket.rate === 0 ? 'Exento' : `${percent(bracket.rate)} sobre el excedente · fija ${money(bracket.fixed_amount)}`)))));
            if (FIELDS[key] && Array.isArray(value))
                return React.createElement("details", { key: key, className: "rounded-md border border-line p-3" },
                    React.createElement("summary", { className: "cursor-pointer text-small font-medium" }, FIELDS[key]),
                    React.createElement("div", { className: "mt-2 space-y-2" }, value.map((entry, i) => React.createElement(RuleValues, { key: i, parameters: entry, code: code }))));
            if (FIELDS[key] && value && typeof value === 'object')
                return React.createElement("details", { key: key, className: "rounded-md border border-line p-3" },
                    React.createElement("summary", { className: "cursor-pointer text-small font-medium" }, FIELDS[key]),
                    React.createElement("div", { className: "mt-2" },
                        React.createElement(RuleValues, { parameters: value, code: code })));
            return null;
        }));
}
export function LegalRulesPage() {
    const org = useOrgId();
    const { can } = useOrg();
    const [at, setAt] = useParam('date');
    const asOf = at || today();
    const [pendingOnly, setPendingOnly] = useState(false);
    const organization = useQuery({ queryKey: [org, 'legal-jurisdiction'], queryFn: () => unwrap(supabase.from('organizations').select('jurisdiction, company_size, srl_rate').eq('id', org).single()) });
    const rules = useQuery({
        queryKey: ['legal-rules', organization.data?.jurisdiction], enabled: Boolean(organization.data),
        queryFn: () => unwrap(supabase.from('legal_rules').select('*, legal_rule_versions(*, legal_sources(authority, url, retrieved_at))').eq('jurisdiction', organization.data.jurisdiction).order('code')),
    });
    const overrides = useQuery({ queryKey: [org, 'rule-overrides'], queryFn: () => unwrap(supabase.from('organization_rule_overrides').select('rule_id, parameters, effective_from, effective_to').eq('organization_id', org)) });
    const view = (rules.data ?? []).map((r) => {
        const versions = [...r.legal_rule_versions].sort((a, b) => b.effective_from.localeCompare(a.effective_from));
        const candidates = versions.filter((v) => v.effective_from <= asOf && (!v.effective_to || v.effective_to > asOf));
        const current = candidates.find((v) => v.status === 'verified') ?? candidates.find((v) => v.status === 'unverified');
        const override = overrides.data?.find((row) => row.rule_id === r.id && row.effective_from <= asOf && (!row.effective_to || row.effective_to > asOf));
        return { rule: r, versions, current, override };
    });
    const unresolved = view.filter((v) => v.current?.status === 'unverified');
    const displayed = pendingOnly ? unresolved : [...view].sort((a, b) => Number(b.current?.status === 'unverified') - Number(a.current?.status === 'unverified') || legalLabel(a.rule.code).localeCompare(legalLabel(b.rule.code), 'es-DO'));
    return React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: "Reglas legales", description: "Consulte qu\u00E9 valores aplica HL Presencia, desde cu\u00E1ndo y qu\u00E9 fuente los respalda.", actions: React.createElement(Field, { label: "Consultar al" }, ({ id }) => React.createElement(DateInput, { id: id, value: asOf, onChange: (e) => setAt(e.target.value), className: "w-44" })) }),
        unresolved.length > 0 && React.createElement(Card, { className: "mb-4 border-warning/40" },
            React.createElement(CardHeader, { title: `${unresolved.length} ${unresolved.length === 1 ? 'regla por revisar' : 'reglas por revisar'}`, description: "Abra la fuente y confirme el per\u00EDodo. Verifique la fuente y la fecha de vigencia antes de usar estos valores en n\u00F3mina.", actions: React.createElement(Button, { "aria-pressed": pendingOnly, onClick: () => setPendingOnly(!pendingOnly) }, pendingOnly ? 'Ver todas' : 'Ver pendientes') })),
        rules.error || organization.error ? React.createElement(ErrorState, { message: "No se pudieron cargar las reglas legales.", onRetry: () => { void organization.refetch(); if (organization.data)
                void rules.refetch(); } })
            : rules.isPending || organization.isPending ? React.createElement(LoadingState, { rows: 8 }) : displayed.length === 0 ? React.createElement(EmptyState, { title: "Sin reglas para mostrar" }) : (React.createElement("div", { className: "grid gap-4 xl:grid-cols-2" }, displayed.map(({ rule, versions, current, override }) => {
                const isSrl = rule.code === 'DO.TSS.SRL.RATES';
                const companyClass = rule.code === 'DO.MINWAGE.COMPANY_CLASSIFICATION';
                const future = [...versions].reverse().find((v) => v.effective_from > asOf && v.status === 'verified');
                return React.createElement(Card, { key: rule.id, className: "min-w-0" },
                    React.createElement(CardHeader, { title: legalLabel(rule.code), description: current ? `Vigente desde ${date(current.effective_from)}${current.effective_to ? ` hasta el ${date(addDaysIso(current.effective_to, -1))}` : ''}` : future ? `Primera versión aplicable desde el ${date(future.effective_from)}` : 'Sin versión aplicable para esta fecha', actions: React.createElement(StatusBadge, { label: current ? (STATUS[current.status] ?? 'Revisar') : 'Sin versión vigente', tone: current?.status === 'verified' ? 'success' : 'warning' }) }),
                    React.createElement("div", { className: "space-y-3 px-4 pb-4 sm:px-5" },
                        current && React.createElement(React.Fragment, null,
                            React.createElement(RuleValues, { code: rule.code, parameters: current.parameters }),
                            override && React.createElement("details", { className: "rounded-md border border-line p-3" },
                                React.createElement("summary", { className: "cursor-pointer text-small font-medium" },
                                    "Ajuste de la empresa desde ",
                                    date(override.effective_from)),
                                React.createElement("div", { className: "mt-2" },
                                    React.createElement(RuleValues, { code: rule.code, parameters: override.parameters }))),
                            companyClass && React.createElement("p", { className: "text-small text-muted" }, "Compare la cantidad de trabajadores y las ventas brutas anuales. Si corresponden a categor\u00EDas distintas, use la superior para determinar el salario m\u00EDnimo."),
                            rule.code === 'DO.MINWAGE.OTHER_CNS_01_2025' && React.createElement("p", { className: "text-small text-muted" }, "Para la jornada parcial comprendida en esta resoluci\u00F3n, divida el m\u00EDnimo mensual entre 23.83 y luego entre 8."),
                            rule.code === 'DO.HOLIDAYS' && React.createElement("p", { className: "text-small text-muted" }, "La fecha observada es la que se aplica al calendario de asistencia."),
                            current.status === 'unverified' && React.createElement("p", { className: "text-small text-warning" }, "Confirme la disposici\u00F3n y su fecha de vigencia con la autoridad indicada antes de usarla. Comparta el documento oficial con la persona que mantiene las reglas de HL Presencia para publicar la versi\u00F3n documentada."),
                            isSrl && React.createElement("p", { className: "text-small" }, organization.data?.srl_rate == null ? 'Falta la tasa SRL asignada a su empresa.' : `Tasa asignada a la empresa ${percent(organization.data.srl_rate)}`),
                            current.legal_sources?.url && React.createElement("a", { className: "inline-flex items-center gap-1 text-small text-primary underline", href: current.legal_sources.url, target: "_blank", rel: "noreferrer" }, DOCUMENTED.has(rule.code) ? 'Sentencia y resolución' : `Fuente de ${current.legal_sources.authority}`),
                            (isSrl || companyClass) && can('settings.manage', 'organization') && React.createElement("div", null,
                                React.createElement(Button, { asChild: true, size: "sm" },
                                    React.createElement(Link, { to: "/settings" }, isSrl ? 'Configurar tasa SRL' : 'Revisar categoría de empresa')))),
                        versions.length > 1 && React.createElement("details", null,
                            React.createElement("summary", { className: "cursor-pointer text-small text-muted" },
                                "Historial de vigencias (",
                                versions.length,
                                ")"),
                            React.createElement("ul", { className: "mt-2 divide-y divide-line" }, versions.map((v) => React.createElement("li", { key: v.id, className: "flex flex-wrap justify-between gap-2 py-2 text-caption" },
                                React.createElement("span", null,
                                    date(v.effective_from),
                                    v.effective_to && ` – ${date(addDaysIso(v.effective_to, -1))}`),
                                React.createElement("span", null, STATUS[v.status] ?? 'Revisar')))))));
            }))));
}
