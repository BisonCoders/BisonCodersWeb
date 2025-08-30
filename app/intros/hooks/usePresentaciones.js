'use client';

import { useState, useEffect } from 'react';

export function usePresentaciones() {
  const [presentaciones, setPresentaciones] = useState([]);
  
  useEffect(() => {
    // Lista de presentaciones disponibles
    // Para agregar tu presentación, añade un objeto aquí con tu información
    const presentacionesDisponibles = [
      {
        nombre: 'ejemplo-presentacion',
        titulo: 'Presentación de Ejemplo',
        autor: 'Tu Nombre Aquí',
        descripcion: 'Plantilla base para crear tu presentación',
        fechaCreacion: '2025-01-01'
      },
      {
        nombre: 'como-contribuir',
        titulo: 'Cómo Contribuir',
        autor: 'BisonCoders',
        descripcion: 'Guía paso a paso para agregar tu presentación',
        fechaCreacion: '2025-01-01'
      }
      // 🚀 AGREGA TU PRESENTACIÓN AQUÍ:
      // {
      //   nombre: 'tu-nombre-aqui',
      //   titulo: 'Tu Nombre - Presentación Personal',
      //   autor: 'Tu Nombre',
      //   descripcion: 'Una breve descripción sobre ti',
      //   fechaCreacion: '2025-01-XX'
      // },
    ];
    
    // Ordenar por fecha de creación (más recientes primero)
    const presentacionesOrdenadas = presentacionesDisponibles.sort((a, b) => 
      new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
    );
    
    setPresentaciones(presentacionesOrdenadas);
  }, []);
  
  return presentaciones;
}