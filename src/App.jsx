import {
  buscarCMEIs,
  buscarDashboard
} from "./services/api";

import "./App.css";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Users,
  School,
  ClipboardList,
  Map,
  BrainCircuit,
  Bell,
  Search,
  ArrowUpRight,
  Baby,
  CheckCircle,
  Clock,
  MapPin,
  ChevronRight
} from "lucide-react";

function App() {
  const [pagina, setPagina] = useState("Dashboard");
  const [cmeis, setCmeis] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro("");

      const [lista, indicadores] = await Promise.all([
        buscarCMEIs(),
        buscarDashboard()
      ]);

      setCmeis(lista);
      setDashboard(indicadores);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar os dados.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const menu = [
    { nome: "Dashboard", icon: LayoutDashboard },
    { nome: "Crianças", icon: Users },
    { nome: "Matrículas", icon: ClipboardList },
    { nome: "CMEIs", icon: School },
    { nome: "Mapa", icon: Map },
    { nome: "Agente Inteligente", icon: BrainCircuit }
  ];

  const ocupacao = dashboard.capacidade_total
    ? Math.round(
        ((dashboard.capacidade_total -
          dashboard.vagas_disponiveis) /
          dashboard.capacidade_total) * 100
      )
    : 0;

  return (
    <div className="app-container">

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">
            <School size={27} />
          </div>

          <div>
            <h2>EducaVaga</h2>
            <span>Gestão de CMEIs</span>
          </div>
        </div>

        <div className="menu-label">MENU PRINCIPAL</div>

        <nav className="menu">
          {menu.map(item => {
            const Icon = item.icon;

            return (
              <button
                key={item.nome}
                className={
                  pagina === item.nome ? "menu-item active" : "menu-item"
                }
                onClick={() => setPagina(item.nome)}
              >
                <Icon size={19} />
                <span>{item.nome}</span>
                {pagina === item.nome && (
                  <ChevronRight size={16} className="menu-arrow" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="footer-icon">
            <BrainCircuit size={20} />
          </div>
          <div>
            <strong>EducaVaga IA</strong>
            <span>Inteligência para educação</span>
          </div>
        </div>

      </aside>

      <main className="main-content">

        <header className="topbar">

          <div className="breadcrumb">
            <span>EducaVaga</span>
            <ChevronRight size={15} />
            <strong>{pagina}</strong>
          </div>

          <div className="topbar-right">
            <div className="system-status">
              <span className="status-dot"></span>
              Sistema operacional
            </div>

            <button className="notification-button">
              <Bell size={19} />
            </button>

            <div className="profile">
              <div className="avatar">AD</div>
              <div>
                <strong>Administrador</strong>
                <span>Gestão municipal</span>
              </div>
            </div>
          </div>

        </header>

        <div className="page-content">

          <div className="welcome-section">
            <div>
              <span className="date-label">PAINEL ADMINISTRATIVO</span>
              <h1>{pagina === "Dashboard"
                ? "Visão geral"
                : pagina
              }</h1>
              <p>
                Acompanhe e gerencie as vagas da educação infantil.
              </p>
            </div>

            <button
              className="refresh-button"
              onClick={carregarDados}
            >
              <ArrowUpRight size={17} />
              Atualizar dados
            </button>
          </div>

          {carregando && (
            <div className="loading">Carregando informações...</div>
          )}

          {erro && (
            <div className="error-message">
              {erro}
              <button onClick={carregarDados}>Tentar novamente</button>
            </div>
          )}

          {!carregando && !erro && pagina === "Dashboard" && (
            <>

              <section className="stats-grid">

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Total de CMEIs</span>
                    <div className="stat-icon green">
                      <School size={21} />
                    </div>
                  </div>
                  <h2>{dashboard.total_cmeis || 0}</h2>
                  <span className="stat-description">
                    Unidades cadastradas
                  </span>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Vagas disponíveis</span>
                    <div className="stat-icon blue">
                      <CheckCircle size={21} />
                    </div>
                  </div>
                  <h2>{dashboard.vagas_disponiveis || 0}</h2>
                  <span className="stat-description">
                    Disponíveis para matrícula
                  </span>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Capacidade total</span>
                    <div className="stat-icon orange">
                      <Users size={21} />
                    </div>
                  </div>
                  <h2>{dashboard.capacidade_total || 0}</h2>
                  <span className="stat-description">
                    Vagas nas unidades
                  </span>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Taxa de ocupação</span>
                    <div className="stat-icon purple">
                      <ClipboardList size={21} />
                    </div>
                  </div>
                  <h2>{ocupacao}%</h2>
                  <span className="stat-description">
                    Ocupação das unidades
                  </span>
                </div>

              </section>

              <section className="content-grid">

                <div className="panel units-panel">
                  <div className="panel-header">
                    <div>
                      <h2>Unidades de atendimento</h2>
                      <p>Resumo das vagas por CMEI</p>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => setPagina("CMEIs")}
                    >
                      Ver todas
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {cmeis.map(cmei => {
                    const percentual = cmei.capacidade
                      ? Math.round(
                          ((cmei.capacidade -
                            cmei.vagas_disponiveis) /
                            cmei.capacidade) * 100
                        )
                      : 0;

                    return (
                      <div className="unit-row" key={cmei.id}>
                        <div className="unit-icon">
                          <School size={21} />
                        </div>

                        <div className="unit-info">
                          <strong>{cmei.nome}</strong>
                          <span>
                            <MapPin size={13} />
                            {cmei.endereco}
                          </span>

                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${percentual}%`
                              }}
                            />
                          </div>
                        </div>

                        <div className="unit-vacancies">
                          <strong>{cmei.vagas_disponiveis}</strong>
                          <span>vagas livres</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="panel intelligence-panel">
                  <div className="ai-icon">
                    <BrainCircuit size={27} />
                  </div>

                  <span className="ai-tag">INTELIGÊNCIA ARTIFICIAL</span>

                  <h2>Agente inteligente</h2>

                  <p>
                    Encontre a melhor unidade para cada criança,
                    considerando disponibilidade e distância.
                  </p>

                  <div className="ai-feature">
                    <CheckCircle size={17} />
                    Análise de vagas disponíveis
                  </div>

                  <div className="ai-feature">
                    <CheckCircle size={17} />
                    Comparação de distâncias
                  </div>

                  <div className="ai-feature">
                    <CheckCircle size={17} />
                    Sugestões de atendimento
                  </div>

                  <button
                    className="ai-button"
                    onClick={() => setPagina("Agente Inteligente")}
                  >
                    Acessar agente
                    <ArrowUpRight size={17} />
                  </button>
                </div>

              </section>

              <section className="panel summary-panel">
                <div className="panel-header">
                  <div>
                    <h2>Resumo da gestão</h2>
                    <p>Indicadores gerais da rede municipal</p>
                  </div>
                </div>

                <div className="summary-grid">
                  <div>
                    <Baby size={21} />
                    <strong>{dashboard.capacidade_total || 0}</strong>
                    <span>Capacidade de atendimento</span>
                  </div>

                  <div>
                    <Clock size={21} />
                    <strong>{dashboard.vagas_disponiveis || 0}</strong>
                    <span>Vagas aguardando ocupação</span>
                  </div>

                  <div>
                    <School size={21} />
                    <strong>{cmeis.length}</strong>
                    <span>Unidades participantes</span>
                  </div>
                </div>
              </section>

            </>
          )}

          {!carregando && !erro && pagina !== "Dashboard" && (
            <section className="panel coming-soon">
              <div className="coming-icon">
                {pagina === "Agente Inteligente"
                  ? <BrainCircuit size={35} />
                  : <School size={35} />
                }
              </div>
              <h2>{pagina}</h2>
              <p>
                Este módulo será desenvolvido nas próximas etapas
                do EducaVaga.
              </p>
            </section>
          )}

        </div>

      </main>

    </div>
  );
}

export default App;
