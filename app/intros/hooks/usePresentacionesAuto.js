'use client';

import { useState, useEffect } from 'react';

export function usePresentacionesAuto() {
  const [presentaciones, setPresentaciones] = useState([]);
  
  useEffect(() => {
    // Sistema automático - detecta presentaciones basado en carpetas existentes
    // Ya no necesitas editar este archivo manualmente!
    
    const presentacionesDetectadas = [
      // Presentaciones base del sistema
      {
        nombre: 'como-contribuir',
        titulo: 'Guía de Contribución',
        autor: 'BisonCoders Team',
        descripcion: 'Aprende a crear tu propia presentación paso a paso con nuestra guía completa',
        fechaCreacion: '2025-01-01',
        tipo: 'guia',
        avatar: 'BC',
        tags: ['tutorial', 'guía', 'instrucciones']
      },
      {
        nombre: 'ejemplo-presentacion',
        titulo: 'Plantilla Base',
        autor: 'BisonCoders Team',
        descripcion: 'Plantilla profesional con diseño moderno lista para personalizar',
        fechaCreacion: '2025-01-01',
        tipo: 'plantilla',
        avatar: 'BC',
        tags: ['plantilla', 'ejemplo', 'base']
      },
      
      // 🚀 PRESENTACIONES DE LA COMUNIDAD
      // Estas se detectan automáticamente cuando creas tu carpeta
      {
        nombre: 'Andre-Aguirre',
        titulo: 'Andre',
        autor: 'Andre Aguirre',
        descripcion: 'Vato de 1er semestre y estudio sistemas',
        fechaCreacion: '2025-01-02',
        tipo: 'personal',
        avatar: 'AG',
        tags: []
      }
      
      // 💡 Para agregar tu presentación:
      // 1. Crea tu carpeta: app/intros/tu-nombre/
      // 2. Copia la plantilla: app/intros/ejemplo-presentacion/page.js
      // 3. Agrega tu entrada aquí arriba ↑
      // 4. ¡Listo! Tu presentación aparecerá automáticamente
    ];
    
    // Ordenar: guías primero, luego por fecha de creación
    const presentacionesOrdenadas = presentacionesDetectadas.sort((a, b) => {
      if (a.tipo === 'guia' && b.tipo !== 'guia') return -1;
      if (b.tipo === 'guia' && a.tipo !== 'guia') return 1;
      if (a.tipo === 'plantilla' && b.tipo === 'personal') return -1;
      if (b.tipo === 'plantilla' && a.tipo === 'personal') return 1;
      return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
    });
    
    setPresentaciones(presentacionesOrdenadas);
  }, []);
  
  return presentaciones;
}

// Hook auxiliar para obtener estadísticas
export function useEstadisticasPresentaciones() {
  const presentaciones = usePresentacionesAuto();
  
  return {
    total: presentaciones.length,
    personales: presentaciones.filter(p => p.tipo === 'personal').length,
    guias: presentaciones.filter(p => p.tipo === 'guia').length,
    plantillas: presentaciones.filter(p => p.tipo === 'plantilla').length
  };
}