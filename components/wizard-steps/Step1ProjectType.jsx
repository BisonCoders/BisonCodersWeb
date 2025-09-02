'use client';

import ProjectTypeSelector from '../ProjectTypeSelector';

const Step1ProjectType = ({ projectData, updateProjectData }) => {
  return (
    <ProjectTypeSelector 
      selectedType={projectData.type}
      onTypeSelect={(type) => updateProjectData({ type })}
    />
  );
};

export default Step1ProjectType;