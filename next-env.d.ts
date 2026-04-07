'use client';

import { useMemo, useState, useTransition } from 'react';
import { Activity, Battery, Crosshair, Plane, Plus, Settings2, Wrench } from 'lucide-react';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DashboardPayload, Drone } from '@/lib/types';

function StatCard({ title, value, hint, icon: Icon }: { title: string; value: string | number; hint: string; icon: React.ElementType }) {
  return (
    <div className="card stat-card">
      <div>
        <p className="eyebrow">{title}</p>
        <h3>{value}</h3>
        <span>{hint}</span>
      </div>
      <div className="icon-wrap"><Icon size={20} /></div>
    </div>
  );
}

function statusClass(status: string) {
  return {
    Operativo: 'badge success',
    'En misión': 'badge info',
    Mantenimiento: 'badge warning',
    Inactivo: 'badge muted',
    Planificada: 'badge info',
    'En curso': 'badge success',
    Completada: 'badge success',
    Cancelada: 'badge muted',
    Pendiente: 'badge warning',
    'En progreso': 'badge info',
    Completado: 'badge success',
    Alta: 'badge danger',
    Media: 'badge warning',
    Baja: 'badge muted',
  }[status] ?? 'badge';
}

async function saveDroneAction(payload: Record<string, FormDataEntryValue>) {
  const response = await fetch('/api/mock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error('No se pudo guardar');
  return response.json();
}

export function Dashboard({ data }: { data: DashboardPayload }) {
  const [selectedBase, setSelectedBase] = useState('Todas');
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const drones = useMemo(() => {
    if (selectedBase === 'Todas') return data.drones;
    return data.drones.filter((drone) => drone.base === selectedBase);
  }, [data.drones, selectedBase]);

  const bases = ['Todas', ...new Set(data.drones.map((drone) => drone.base))];
  const operational = drones.filter((d) => d.estado === 'Operativo').length;
  const onMission = drones.filter((d) => d.estado === 'En misión').length;
  const avgBattery = Math.round(drones.reduce((acc, d) => acc + d.bateria, 0) / Math.max(drones.length, 1));
  const chartData = drones.map((drone) => ({ nombre: drone.nombre, bateria: drone.bateria, horas: drone.horasTotales }));

  function onSubmit(formData: FormData) {
    const payload = Object.fromEntries(formData.entries());
    startTransition(async () => {
      try {
        const result = await saveDroneAction(payload);
        setMessage(result.message || 'Dron guardado correctamente');
      } catch {
        setMessage('No se pudo guardar. Revisa la URL de Apps Script.');
      }
    });
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div>
          <p className="brand-kicker">Studio</p>
          <h1>Fleet Drones</h1>
          <p className="sidebar-copy">Panel de operaciones, misiones y mantenimiento conectado a Google Sheets.</p>
        </div>

        <nav className="sidebar-nav">
          <a className="nav-item active" href="#resumen"><Plane size={18} /> Resumen</a>
          <a className="nav-item" href="#flota"><Activity size={18} /> Flota</a>
          <a className="nav-item" href="#misiones"><Crosshair size={18} /> Misiones</a>
          <a className="nav-item" href="#mantenimiento"><Wrench size={18} /> Mantenimiento</a>
          <a className="nav-item" href="#configuracion"><Settings2 size={18} /> Integración</a>
        </nav>
      </aside>

      <section className="content">
        <header className="topbar" id="resumen">
          <div>
            <p className="eyebrow">Centro de control</p>
            <h2>Gestión inteligente de flota</h2>
          </div>
          <select value={selectedBase} onChange={(e) => setSelectedBase(e.target.value)} className="select">
            {bases.map((base) => <option key={base}>{base}</option>)}
          </select>
        </header>

        <section className="stats-grid">
          <StatCard title="Drones visibles" value={drones.length} hint="Inventario filtrado por base" icon={Plane} />
          <StatCard title="Operativos" value={operational} hint="Listos para salida" icon={Activity} />
          <StatCard title="En misión" value={onMission} hint="Operaciones activas" icon={Crosshair} />
          <StatCard title="Batería media" value={`${avgBattery}%`} hint="Promedio del parque" icon={Battery} />
        </section>

        <section className="two-column">
          <div className="card chart-card">
            <div className="section-head">
              <div>
                <p className="eyebrow">Telemetría</p>
                <h3>Nivel de batería por dron</h3>
              </div>
            </div>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bateria" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card form-card" id="configuracion">
            <div className="section-head">
              <div>
                <p className="eyebrow">Alta rápida</p>
                <h3>Registrar dron</h3>
              </div>
              <Plus size={18} />
            </div>
            <form action={onSubmit} className="grid-form">
              <input name="id" placeholder="ID" required />
              <input name="nombre" placeholder="Nombre" required />
              <input name="modelo" placeholder="Modelo" required />
              <input name="piloto" placeholder="Piloto" required />
              <input name="base" placeholder="Base" required />
              <input name="autonomiaMin" type="number" placeholder="Autonomía (min)" required />
              <input name="bateria" type="number" placeholder="Batería %" required />
              <select name="estado" defaultValue="Operativo">
                <option>Operativo</option>
                <option>En misión</option>
                <option>Mantenimiento</option>
                <option>Inactivo</option>
              </select>
              <button type="submit" className="button" disabled={isPending}>{isPending ? 'Guardando...' : 'Guardar en Sheets'}</button>
            </form>
            <p className="helper">La app usa datos mock hasta que configures <code>NEXT_PUBLIC_APPS_SCRIPT_URL</code>.</p>
            {message ? <p className="message">{message}</p> : null}
          </div>
        </section>

        <section className="card" id="flota">
          <div className="section-head">
            <div>
              <p className="eyebrow">Inventario</p>
              <h3>Estado de la flota</h3>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Dron</th>
                  <th>Modelo</th>
                  <th>Piloto</th>
                  <th>Base</th>
                  <th>Batería</th>
                  <th>Autonomía</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {drones.map((drone: Drone) => (
                  <tr key={drone.id}>
                    <td>
                      <strong>{drone.nombre}</strong>
                      <span className="subline">{drone.id}</span>
                    </td>
                    <td>{drone.modelo}</td>
                    <td>{drone.piloto}</td>
                    <td>{drone.base}</td>
                    <td>{drone.bateria}%</td>
                    <td>{drone.autonomiaMin} min</td>
                    <td><span className={statusClass(drone.estado)}>{drone.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="three-column">
          <div className="card" id="misiones">
            <div className="section-head"><h3>Misiones</h3></div>
            <div className="stack-list">
              {data.missions.map((mission) => (
                <article key={mission.id} className="list-card">
                  <div>
                    <strong>{mission.nombre}</strong>
                    <p>{mission.zona} · {mission.fecha}</p>
                  </div>
                  <div className="list-tags">
                    <span className={statusClass(mission.estado)}>{mission.estado}</span>
                    <span className={statusClass(mission.prioridad)}>{mission.prioridad}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="card" id="mantenimiento">
            <div className="section-head"><h3>Mantenimiento</h3></div>
            <div className="stack-list">
              {data.maintenance.map((item) => (
                <article key={item.id} className="list-card">
                  <div>
                    <strong>{item.tipo}</strong>
                    <p>{item.droneId} · {item.tecnico}</p>
                  </div>
                  <span className={statusClass(item.estado)}>{item.estado}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="section-head"><h3>Esquema Google Sheets</h3></div>
            <ul className="schema-list">
              <li><strong>drones</strong>: id, nombre, modelo, piloto, base, autonomiaMin, bateria, estado, ultimoVuelo, horasTotales</li>
              <li><strong>missions</strong>: id, droneId, nombre, zona, fecha, estado, prioridad</li>
              <li><strong>maintenance</strong>: id, droneId, tipo, fecha, tecnico, estado</li>
            </ul>
          </div>
        </section>
      </section>
    </main>
  );
}
