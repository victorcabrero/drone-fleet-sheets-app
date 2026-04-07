import { DashboardPayload } from './types';

export const mockData: DashboardPayload = {
  drones: [
    { id: 'DR-001', nombre: 'Atlas 1', modelo: 'DJI Matrice 300', piloto: 'Lucía Herrera', base: 'Madrid', autonomiaMin: 45, bateria: 86, estado: 'Operativo', ultimoVuelo: '2026-04-06T10:30:00', horasTotales: 234 },
    { id: 'DR-002', nombre: 'Falcon Sur', modelo: 'Autel Evo Max 4T', piloto: 'Javier Ruiz', base: 'Sevilla', autonomiaMin: 38, bateria: 61, estado: 'En misión', ultimoVuelo: '2026-04-07T08:20:00', horasTotales: 187 },
    { id: 'DR-003', nombre: 'Orion', modelo: 'Parrot Anafi AI', piloto: 'Carla Soto', base: 'Valencia', autonomiaMin: 32, bateria: 19, estado: 'Mantenimiento', ultimoVuelo: '2026-04-02T16:45:00', horasTotales: 312 },
    { id: 'DR-004', nombre: 'Nimbus', modelo: 'Skydio X10', piloto: 'Pablo León', base: 'Bilbao', autonomiaMin: 40, bateria: 44, estado: 'Operativo', ultimoVuelo: '2026-04-05T14:10:00', horasTotales: 141 },
    { id: 'DR-005', nombre: 'Horus', modelo: 'DJI Mavic 3 Enterprise', piloto: 'Marina Gil', base: 'Barcelona', autonomiaMin: 42, bateria: 77, estado: 'Inactivo', ultimoVuelo: '2026-03-28T11:05:00', horasTotales: 96 }
  ],
  missions: [
    { id: 'MS-101', droneId: 'DR-002', nombre: 'Inspección fotovoltaica', zona: 'Sevilla Oeste', fecha: '2026-04-07', estado: 'En curso', prioridad: 'Alta' },
    { id: 'MS-102', droneId: 'DR-001', nombre: 'Vigilancia perimetral', zona: 'Madrid Norte', fecha: '2026-04-08', estado: 'Planificada', prioridad: 'Media' },
    { id: 'MS-103', droneId: 'DR-004', nombre: 'Cartografía cantera', zona: 'Bilbao Este', fecha: '2026-04-09', estado: 'Planificada', prioridad: 'Alta' },
    { id: 'MS-104', droneId: 'DR-003', nombre: 'Revisión térmica', zona: 'Valencia Puerto', fecha: '2026-04-03', estado: 'Cancelada', prioridad: 'Baja' }
  ],
  maintenance: [
    { id: 'MT-201', droneId: 'DR-003', tipo: 'Cambio de hélices', fecha: '2026-04-07', tecnico: 'T. Navarro', estado: 'En progreso' },
    { id: 'MT-202', droneId: 'DR-005', tipo: 'Calibración IMU', fecha: '2026-04-10', tecnico: 'S. Vega', estado: 'Pendiente' },
    { id: 'MT-203', droneId: 'DR-001', tipo: 'Revisión general', fecha: '2026-03-30', tecnico: 'A. Prieto', estado: 'Completado' }
  ]
};
