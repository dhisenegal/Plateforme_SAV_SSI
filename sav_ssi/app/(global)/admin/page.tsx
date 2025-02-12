'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { getEquipmentStats, getUserStats, getEquipmentDistribution, getSystemsForLegend, type SystemData } from '@/actions/admin/stat';

const roleColors = {
  admin: "#FF6B6B",       
  technicien: "#4ECDC4", 
  client: "#45B7D1",
  commercial: "#96CEB4",  
};

const generateColors = (count: number) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(`hsl(${(i * 360) / count}, 70%, 50%)`);
  }
  return colors;
};

const AdminPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [equipmentData, setEquipmentData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [systems, setSystems] = useState<SystemData[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [equipStats, userStats, equipDist, systemsList] = await Promise.all([
        getEquipmentStats(),
        getUserStats(),
        getEquipmentDistribution(),
        getSystemsForLegend()
      ]);

      setEquipmentData(equipStats);
      setUserData(userStats);
      setPieData(equipDist);
      setSystems(systemsList);
      setColors(generateColors(systemsList.length));
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient || isLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Tableau de bord</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Équipements ajoutés</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={equipmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {systems.map((system, index) => (
                  <Line
                    key={system.id}
                    type="monotone"
                    dataKey={system.nom.toLowerCase()}
                    stroke={colors[index]}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs ajoutés</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend 
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                />
                {userData[0] && Object.keys(userData[0])
                  .filter(key => key !== 'name')
                  .map((role) => (
                    <Bar 
                      key={role} 
                      dataKey={role} 
                      fill={roleColors[role] || '#8884d8'} 
                      name={role.charAt(0).toUpperCase() + role.slice(1)}
                    />
                  ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des équipements</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={pieData} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80} 
                  fill="#8884d8" 
                  dataKey="value"
                  label={(entry) => entry.name}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;