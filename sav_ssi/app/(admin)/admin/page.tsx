"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

const equipmentData = [
  { name: 'Jan', sdi: 30, extincteurs: 20, autres: 10 },
  { name: 'Feb', sdi: 40, extincteurs: 25, autres: 15 },
  { name: 'Mar', sdi: 35, extincteurs: 30, autres: 20 },
  { name: 'Apr', sdi: 50, extincteurs: 40, autres: 25 },
  { name: 'May', sdi: 60, extincteurs: 45, autres: 30 },
  { name: 'Jun', sdi: 70, extincteurs: 50, autres: 35 },
  { name: 'Jul', sdi: 80, extincteurs: 55, autres: 40 },
];

const userData = [
  { name: 'Jan', clients: 10, responsables: 5, techniciens: 15 },
  { name: 'Feb', clients: 15, responsables: 7, techniciens: 20 },
  { name: 'Mar', clients: 20, responsables: 10, techniciens: 25 },
  { name: 'Apr', clients: 25, responsables: 12, techniciens: 30 },
  { name: 'May', clients: 30, responsables: 15, techniciens: 35 },
  { name: 'Jun', clients: 35, responsables: 17, techniciens: 40 },
  { name: 'Jul', clients: 40, responsables: 20, techniciens: 45 },
];

const pieData = [
  { name: 'SDI', value: 400 },
  { name: 'Extincteurs', value: 300 },
  { name: 'Autres', value: 300 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const AdminPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
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
                <Line type="monotone" dataKey="sdi" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="extincteurs" stroke="#82ca9d" />
                <Line type="monotone" dataKey="autres" stroke="#ffc658" />
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
                <Legend />
                <Bar dataKey="clients" fill="#8884d8" />
                <Bar dataKey="responsables" fill="#82ca9d" />
                <Bar dataKey="techniciens" fill="#ffc658" />
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
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;