import { CampusBuilding, FloorState, RoomState, RoomType } from '../types/twin';

function createRoom(
  id: string,
  name: string,
  floor: number,
  buildingId: string,
  roomType: RoomType,
  areaSqM: number,
  designOccupancy: number,
  baseKw: number,
  baseTemp = 23.5
): RoomState {
  return {
    id,
    name,
    floor,
    buildingId,
    roomType,
    areaSqM,
    occupancy: 0,
    designOccupancy,
    temperature: baseTemp,
    targetTemperature: 23.0,
    hvacPowerKw: baseKw * 0.45,
    hvacStatus: 'on',
    lightingPowerKw: baseKw * 0.25,
    lightingLux: 450,
    lightingStatus: 'on',
    plugLoadKw: baseKw * 0.30,
    totalPowerKw: baseKw,
    co2Ppm: 420,
    humidity: 50,
  };
}

function createBuildingFloors(
  bId: string,
  prefix: string,
  floorSpecs: Array<{
    name: string;
    rooms: Array<{ name: string; type: RoomType; area: number; occ: number; baseKw: number; baseTemp?: number }>;
  }>
): FloorState[] {
  return floorSpecs.map((spec, fIdx) => {
    const floorNumber = (fIdx + 1) as 1 | 2 | 3 | 4;
    const rooms = spec.rooms.map((r, rIdx) =>
      createRoom(
        `${bId}-f${floorNumber}-r${rIdx + 1}`,
        `${prefix} ${r.name}`,
        floorNumber,
        bId,
        r.type,
        r.area,
        r.occ,
        r.baseKw,
        r.baseTemp ?? 23.5
      )
    );

    const totalPower = rooms.reduce((acc, r) => acc + r.totalPowerKw, 0);
    const totalOcc = rooms.reduce((acc, r) => acc + r.occupancy, 0);

    return {
      floorNumber,
      name: spec.name,
      rooms,
      totalPowerKw: totalPower,
      totalOccupancy: totalOcc,
      avgTemperature: 23.5,
      status: 'healthy',
    };
  });
}

export function generateInitialBuildings(): CampusBuilding[] {
  // Building 1: Academic Block A (4 Floors)
  const b1Floors = createBuildingFloors('academic-a', 'A', [
    {
      name: 'Ground Floor — Administration & Lecture Halls',
      rooms: [
        { name: '101 Dean & Admin Wing', type: 'office', area: 120, occ: 20, baseKw: 8.5 },
        { name: '102 Smart Classroom A1', type: 'classroom', area: 90, occ: 60, baseKw: 11.2 },
        { name: '103 Faculty Lounge', type: 'office', area: 70, occ: 15, baseKw: 5.4 },
        { name: '104 Main Lecture Hall 1', type: 'auditorium', area: 160, occ: 120, baseKw: 18.0 },
      ],
    },
    {
      name: 'Floor 1 — Computer Science Dept & Labs',
      rooms: [
        { name: '201 CS Dept Office', type: 'office', area: 85, occ: 18, baseKw: 6.2 },
        { name: '202 Embedded Systems Lab', type: 'lab', area: 110, occ: 45, baseKw: 14.5 },
        { name: '203 Smart Classroom A2', type: 'classroom', area: 90, occ: 60, baseKw: 10.8 },
        { name: '204 CS Seminar Hall', type: 'classroom', area: 110, occ: 80, baseKw: 12.6 },
      ],
    },
    {
      name: 'Floor 2 — AI & Data Science Wing',
      rooms: [
        { name: '301 AI & Deep Learning Lab', type: 'lab', area: 115, occ: 40, baseKw: 17.5 },
        { name: '302 Research Scholars Bay', type: 'office', area: 85, occ: 25, baseKw: 7.8 },
        { name: '303 Data Science Lab', type: 'lab', area: 110, occ: 45, baseKw: 15.2 },
        { name: '304 Interactive Classroom A3', type: 'classroom', area: 90, occ: 60, baseKw: 10.5 },
      ],
    },
    {
      name: 'Floor 3 — PG Studies & Conference Center',
      rooms: [
        { name: '401 PG Department Library', type: 'library', area: 100, occ: 35, baseKw: 7.5 },
        { name: '402 Executive Conference Suite', type: 'office', area: 95, occ: 30, baseKw: 9.0 },
        { name: '403 Boardroom & Video Hub', type: 'office', area: 80, occ: 20, baseKw: 8.2 },
        { name: '404 Postgraduate Seminar Hall', type: 'auditorium', area: 130, occ: 90, baseKw: 14.0 },
      ],
    },
  ]);

  // Building 2: Academic Block B (4 Floors)
  const b2Floors = createBuildingFloors('academic-b', 'B', [
    {
      name: 'Ground Floor — Core Sciences & Student Hub',
      rooms: [
        { name: '101 Student Affairs Center', type: 'office', area: 100, occ: 25, baseKw: 7.2 },
        { name: '102 Applied Physics Lab', type: 'lab', area: 110, occ: 40, baseKw: 13.0 },
        { name: '103 General Classroom B1', type: 'classroom', area: 95, occ: 65, baseKw: 11.0 },
        { name: '104 Chemistry Instrumentation', type: 'lab', area: 105, occ: 35, baseKw: 12.5 },
      ],
    },
    {
      name: 'Floor 1 — Electronics & Telecommunication',
      rooms: [
        { name: '201 E&TC Department Office', type: 'office', area: 85, occ: 15, baseKw: 5.8 },
        { name: '202 VLSI & Microelectronics Lab', type: 'lab', area: 120, occ: 45, baseKw: 16.0 },
        { name: '203 Signal Processing Lab', type: 'lab', area: 105, occ: 40, baseKw: 13.8 },
        { name: '204 Smart Classroom B2', type: 'classroom', area: 90, occ: 60, baseKw: 10.5 },
      ],
    },
    {
      name: 'Floor 2 — Mechanical & Automation Wing',
      rooms: [
        { name: '301 CAD / CAM Simulation Center', type: 'lab', area: 130, occ: 50, baseKw: 19.5 },
        { name: '302 Mechatronics Studio', type: 'lab', area: 110, occ: 40, baseKw: 15.0 },
        { name: '303 Faculty Cabins Wing', type: 'office', area: 90, occ: 20, baseKw: 6.5 },
        { name: '304 Smart Classroom B3', type: 'classroom', area: 90, occ: 60, baseKw: 10.2 },
      ],
    },
    {
      name: 'Floor 3 — Central Auditorium & Arts',
      rooms: [
        { name: '401 Main Auditorium Tier 2', type: 'auditorium', area: 180, occ: 150, baseKw: 22.0 },
        { name: '402 Audio-Visual Control NOC', type: 'office', area: 60, occ: 8, baseKw: 6.0 },
        { name: '403 Visiting Faculty Suites', type: 'office', area: 80, occ: 15, baseKw: 6.8 },
        { name: '404 Green Room & Staging Area', type: 'office', area: 75, occ: 20, baseKw: 5.5 },
      ],
    },
  ]);

  // Building 3: Central Library (4 Floors)
  const b3Floors = createBuildingFloors('library', 'L', [
    {
      name: 'Ground Floor — Circulation & General Stacks',
      rooms: [
        { name: '101 Circulation & Help Desk', type: 'library', area: 95, occ: 20, baseKw: 5.5 },
        { name: '102 Periodicals & Newspapers', type: 'library', area: 110, occ: 40, baseKw: 6.8 },
        { name: '103 Chief Librarian Suite', type: 'office', area: 65, occ: 6, baseKw: 3.5 },
        { name: '104 Open Reading Hall A', type: 'library', area: 150, occ: 80, baseKw: 9.8 },
      ],
    },
    {
      name: 'Floor 1 — Digital Library & Media Center',
      rooms: [
        { name: '201 Digital E-Resource Lab', type: 'lab', area: 120, occ: 60, baseKw: 16.5 },
        { name: '202 Multimedia & Audio Stacks', type: 'library', area: 90, occ: 30, baseKw: 7.2 },
        { name: '203 Collaborative Discussion Hub', type: 'classroom', area: 85, occ: 25, baseKw: 6.0 },
        { name: '204 Open Reading Hall B', type: 'library', area: 140, occ: 75, baseKw: 9.0 },
      ],
    },
    {
      name: 'Floor 2 — Engineering Reference & Theses',
      rooms: [
        { name: '301 Technical Reference Stacks', type: 'library', area: 130, occ: 45, baseKw: 7.5 },
        { name: '302 Individual Quiet Carrels', type: 'library', area: 100, occ: 40, baseKw: 5.2 },
        { name: '303 Thesis & Research Archives', type: 'library', area: 95, occ: 25, baseKw: 5.8 },
        { name: '304 Faculty Research Sanctum', type: 'office', area: 80, occ: 15, baseKw: 4.8 },
      ],
    },
    {
      name: 'Floor 3 — Silent Research Sanctuary',
      rooms: [
        { name: '401 Rare Books & Heritage Archive', type: 'library', area: 90, occ: 15, baseKw: 6.0 },
        { name: '402 Silent Study Sanctuary', type: 'library', area: 160, occ: 90, baseKw: 8.5 },
        { name: '403 Academic Writing Center', type: 'office', area: 75, occ: 20, baseKw: 4.2 },
        { name: '404 Reading Terrace View', type: 'recreation', area: 95, occ: 30, baseKw: 4.0 },
      ],
    },
  ]);

  // Building 4: Computing & Innovation Labs (4 Floors)
  const b4Floors = createBuildingFloors('labs', 'C', [
    {
      name: 'Ground Floor — Campus Data Center & Fab Lab',
      rooms: [
        { name: '101 Campus Tier-2 Data Center', type: 'server_room', area: 140, occ: 5, baseKw: 38.0, baseTemp: 19.5 },
        { name: '102 IoT & Embedded Hardware Fab', type: 'lab', area: 110, occ: 35, baseKw: 15.5 },
        { name: '103 Network Operations Center (NOC)', type: 'office', area: 85, occ: 12, baseKw: 10.5 },
        { name: '104 High Voltage UPS & Battery', type: 'server_room', area: 80, occ: 3, baseKw: 14.0 },
      ],
    },
    {
      name: 'Floor 1 — Cloud Infrastructure & HPC',
      rooms: [
        { name: '201 High Performance Cluster (HPC)', type: 'server_room', area: 120, occ: 8, baseKw: 32.0, baseTemp: 20.0 },
        { name: '202 Cloud Virtualization Lab', type: 'lab', area: 115, occ: 45, baseKw: 18.0 },
        { name: '203 Cyber Security Operations (SOC)', type: 'lab', area: 95, occ: 25, baseKw: 13.5 },
        { name: '204 Systems Software Testing Lab', type: 'lab', area: 105, occ: 40, baseKw: 15.0 },
      ],
    },
    {
      name: 'Floor 2 — Software Systems & VR Lab',
      rooms: [
        { name: '301 Full Stack & Web Systems Lab', type: 'lab', area: 110, occ: 45, baseKw: 14.8 },
        { name: '302 VR & Spatial Computing Lab', type: 'lab', area: 100, occ: 30, baseKw: 18.2 },
        { name: '303 Hackathon & Sprint Den', type: 'classroom', area: 115, occ: 55, baseKw: 13.5 },
        { name: '304 Open Source Workspace', type: 'office', area: 90, occ: 30, baseKw: 8.5 },
      ],
    },
    {
      name: 'Floor 3 — Innovation Incubator & Maker Space',
      rooms: [
        { name: '401 Student Tech Incubator', type: 'office', area: 130, occ: 45, baseKw: 12.0 },
        { name: '402 3D Rapid Prototyping Lab', type: 'lab', area: 95, occ: 25, baseKw: 16.5 },
        { name: '403 Investor Pitch & Demo Theater', type: 'auditorium', area: 100, occ: 60, baseKw: 11.0 },
        { name: '404 Startup Lounge & Mentors', type: 'recreation', area: 85, occ: 25, baseKw: 6.8 },
      ],
    },
  ]);

  // Building 5: Student Center & Canteen (4 Floors)
  const b5Floors = createBuildingFloors('student-center', 'S', [
    {
      name: 'Ground Floor — Central Dining & Kitchen',
      rooms: [
        { name: '101 Main Campus Food Court', type: 'canteen', area: 180, occ: 150, baseKw: 24.0 },
        { name: '102 Industrial Kitchen & Cold Store', type: 'canteen', area: 120, occ: 18, baseKw: 31.0 },
        { name: '103 Express Beverages & Bakery', type: 'canteen', area: 70, occ: 20, baseKw: 9.5 },
        { name: '104 Covered Patio Dining', type: 'canteen', area: 110, occ: 70, baseKw: 6.0 },
      ],
    },
    {
      name: 'Floor 1 — Student Union & Cultural Wing',
      rooms: [
        { name: '201 Student Council Secretariat', type: 'office', area: 85, occ: 20, baseKw: 5.5 },
        { name: '202 Cultural & Drama Rehearsal', type: 'recreation', area: 110, occ: 40, baseKw: 8.2 },
        { name: '203 Student Cooperative Store', type: 'office', area: 80, occ: 25, baseKw: 6.0 },
        { name: '204 Alumni & Networking Lounge', type: 'office', area: 95, occ: 30, baseKw: 7.0 },
      ],
    },
    {
      name: 'Floor 2 — Indoor Sports & Wellness Arena',
      rooms: [
        { name: '301 Badminton & Table Tennis Arena', type: 'recreation', area: 160, occ: 60, baseKw: 12.0 },
        { name: '302 Campus Fitness Center & Gym', type: 'recreation', area: 120, occ: 45, baseKw: 15.5 },
        { name: '303 Yoga & Mindfulness Studio', type: 'recreation', area: 85, occ: 30, baseKw: 4.8 },
        { name: '304 Sports Admin & Locker Rooms', type: 'office', area: 80, occ: 15, baseKw: 4.5 },
      ],
    },
    {
      name: 'Floor 3 — Multipurpose Hall & Rooftop Lounge',
      rooms: [
        { name: '401 Multipurpose Activity Hall', type: 'auditorium', area: 160, occ: 120, baseKw: 17.0 },
        { name: '402 Music & Acoustics Jam Room', type: 'recreation', area: 75, occ: 18, baseKw: 6.5 },
        { name: '403 Fine Arts & Design Studio', type: 'classroom', area: 95, occ: 35, baseKw: 7.2 },
        { name: '404 Solar Terrace & Green Deck', type: 'recreation', area: 100, occ: 40, baseKw: 4.0 },
      ],
    },
  ]);

  const rawBuildings = [
    {
      id: 'academic-a',
      name: 'Academic Block A',
      type: 'Academic (CS & AI)',
      position: [-13, 0, -6] as [number, number, number],
      size: [6.8, 6.4, 5.2] as [number, number, number],
      floors: 4 as const,
      floorsData: b1Floors,
      solarCapacityKw: 42,
    },
    {
      id: 'academic-b',
      name: 'Academic Block B',
      type: 'Academic (Core Engg)',
      position: [-13, 0, 8] as [number, number, number],
      size: [6.8, 6.4, 5.2] as [number, number, number],
      floors: 4 as const,
      floorsData: b2Floors,
      solarCapacityKw: 42,
    },
    {
      id: 'library',
      name: 'Central Library',
      type: 'Library & Learning Resource',
      position: [0, 0, -14] as [number, number, number],
      size: [8.5, 6.4, 5.4] as [number, number, number],
      floors: 4 as const,
      floorsData: b3Floors,
      solarCapacityKw: 48,
    },
    {
      id: 'labs',
      name: 'Computing & Innovation Labs',
      type: 'Data Center & Advanced R&D',
      position: [13, 0, -6] as [number, number, number],
      size: [7.2, 6.4, 5.4] as [number, number, number],
      floors: 4 as const,
      floorsData: b4Floors,
      solarCapacityKw: 45,
    },
    {
      id: 'student-center',
      name: 'Student Center & Canteen',
      type: 'Amenities & Dining',
      position: [13, 0, 8] as [number, number, number],
      size: [7.2, 6.4, 5.4] as [number, number, number],
      floors: 4 as const,
      floorsData: b5Floors,
      solarCapacityKw: 38,
    },
  ];

  return rawBuildings.map((b) => {
    const totalDesignOccupancy = b.floorsData.reduce(
      (acc, f) => acc + f.rooms.reduce((rAcc, r) => rAcc + r.designOccupancy, 0),
      0
    );
    const totalBasePower = b.floorsData.reduce(
      (acc, f) => acc + f.rooms.reduce((rAcc, r) => rAcc + r.totalPowerKw, 0),
      0
    );

    return {
      ...b,
      energyKw: totalBasePower,
      cumulativeKwh: 0,
      carbonKg: 0,
      costInr: 0,
      occupancy: 0,
      designOccupancy: totalDesignOccupancy,
      solarKw: 0,
      status: 'healthy' as const,
      alertsCount: 0,
      efficiencyScore: 92,
      hvacEnergyKwh: 0,
      lightingEnergyKwh: 0,
      equipmentEnergyKwh: 0,
    };
  });
}
