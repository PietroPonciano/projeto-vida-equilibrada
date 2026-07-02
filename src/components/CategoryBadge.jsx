import React from 'react';
import { CORES_CATEGORIAS } from '../constants/finance';

const CategoryBadge = ({ categoria }) => {
  const cor = CORES_CATEGORIAS[categoria] || CORES_CATEGORIAS['Outros'];

  return (
    <span
      className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
      style={{
        backgroundColor: `${cor}15`,
        color: cor
      }}
    >
      {categoria}
    </span>
  );
};

export default CategoryBadge;