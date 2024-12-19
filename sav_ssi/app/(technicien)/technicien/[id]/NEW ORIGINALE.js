 {/* Section spécifique à la maintenance */}
 {type === 'maintenance' && details.systeme === 'SYSTÈME DE DETECTION INCENDIE CONVENTIONNEL' && (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Détection Incendie</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Tâche</th>
            <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Statut</th>
            <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Observations</th>
          </tr>
        </thead>
        <tbody>
          {[ 
            'Test fonctionnalité du système*',
            'Vérification carte électronique de la centrale',
            'Test alimentation et batterie de la centrale',
            'Dépoussiérage centrale',
            'Dépoussiérage des détecteurs',
            'Dépoussiérage déclencheurs manuel',
            'Dépoussiérage des sirènes',
            'Test fonctionnalité périphériques*',
            'Test fonctionnalité de l\'ensemble des équipements*'
          ].map((task, idx) => (
            <tr key={idx} className="border-b">
              <td className="p-3">{task}</td>
              <td className="p-3">
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input type="radio" name={`statut-${idx}`} className="form-radio text-green-600" />
                    <span className="ml-2">Valide</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name={`statut-${idx}`} className="form-radio text-red-600" />
                    <span className="ml-2">Non valide</span>
                  </label>
                </div>
              </td>
              <td className="p-3">
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded-md" 
                  rows={3} 
                  placeholder="Entrez vos observations pour cette tâche"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
     {type === 'maintenance' && details.systeme === 'MOYENS DE SECOURS EXTINCTEURS' && (
  <div className="mt-6">
  <h2 className="text-lg font-semibold text-gray-900 mb-4">
  Moyens de Secours - Extincteurs
  </h2>
  <div className="overflow-x-auto">
  <table className="min-w-full bg-white border border-gray-200">
  <thead>
    <tr>
      {[
        "Numéro",
        "EMPLACEMENT DE L'EXTINCTEUR",
        "MARQUE",
        "TYPE EXTINCTEUR",
        "PP PA",
        "ANNEE",
        "V5 ou V10",
        "DATE DERNIERE V10 ou V5",
        "A REFORMER",
        "EXT. HS (Si à réparer, à ch.)",
        "VA FAITE",
        "PRESSION PP RELEVE",
        "CH. A FAIRE",
        "CHARGE DE REF.",
        "AZOTE",
        "AG EXT",
        "SPARKLET",
        "POIDS MAX",
        "POIDS MIN",
        "POIDS MESURE",
        "TARE EN GRAM",
        "EXT. A FIXER",
        "MANQUE PANNEAU",
        "NUMEROTATION ETX. PA. A POSER",
        "OBSERVATIONS",
      ].map((col, idx) => (
        <th key={idx} className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
          {col}
        </th>
      ))}
    </tr>
  </thead>
  <tbody>
    {/* Affiche uniquement la première ligne */}
    {[
      0, // Indice pour la première ligne
    ].map((rowIdx) => (
      <tr key={rowIdx} className="border-b">
        <td className="p-3">{rowIdx + 1}</td>
        {Array(24)
          .fill("")
          .map((_, colIdx) => (
            <td key={colIdx} className="p-3">
              {rowIdx === 0 && colIdx === 0 ? "Exemple" : ""}
            </td>
          ))}
      </tr>
    ))}
  
    {/* Ajouter des lignes supplémentaires */}
    {details.extincteurs?.slice(1).map((extincteur, rowIdx) => (
      <tr key={rowIdx + 1} className="border-b">
        <td className="p-3">{rowIdx + 2}</td>
        {Array(24)
          .fill("")
          .map((_, colIdx) => (
            <td key={colIdx} className="p-3">
              {extincteur[colIdx] || ""}
            </td>
          ))}
      </tr>
    ))}
  </tbody>
  </table>
  <div className="mt-4 text-center">
  <button
    onClick={() => {
      // Ajouter une nouvelle ligne (par exemple, vide)
      setDetails({
        ...details,
        extincteurs: [...details.extincteurs, {}], // Ajout d'un objet vide comme ligne
      });
    }}
    className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-400"
  >
    Ajouter une ligne
  </button>
  </div>
  </div>
  </div>
  )}
  
  
  {type === 'maintenance' && details.systeme === 'CENTRALISATEUR DE MISE EN SECURITE INCENDIE' && (
  <div className="mt-6">
  <h2 className="text-lg font-semibold text-gray-900 mb-4">CENTRALISATEUR DE MISE EN SECURITE INCENDIE</h2>
  <table className="min-w-full bg-white border border-gray-200">
  <thead>
  <tr>
    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Tâche</th>
    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Statut</th>
    <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Observations</th>
  </tr>
  </thead>
  <tbody>
  {[
    'Test fonctionnalité *',
    'Vérification carte électronique de la centrale',
    'Dépoussiérage des détecteurs',
    'Dépoussiérage des sirènes',
    'Vérification alimentation des panneaux lumineux',
    'Vérification de la pression des bouteilles',
    'Test fonctionnalité périphériques*',
  ].map((task, idx) => (
    <tr key={idx} className="border-b">
      <td className="p-3">{task}</td>
      <td className="p-3">
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name={`statut-extincteurs-${idx}`}
              className="form-radio text-green-600"
            />
            <span className="ml-2">Valide</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name={`statut-extincteurs-${idx}`}
              className="form-radio text-red-600"
            />
            <span className="ml-2">Non valide</span>
          </label>
        </div>
      </td>
      <td className="p-3">
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={3}
          placeholder="Entrez vos observations pour cette tâche"
        />
      </td>
    </tr>
  ))}
  </tbody>
  </table>
  </div>
  )}
                {type === 'maintenance' && details.systeme === 'MOYENS DE SECOURS RIA' && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Moyens de Secours - RIA</h2>
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead>
                        <tr>
                          <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Tâche</th>
                          <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Statut</th>
                          <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Observations</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          'Vérification de l\'accessibilité',
                          'Inspection du boîtier',
                          'Test de pression',
                          'Vérification de la vanne d\'arrêt',
                          'Contrôle du flexible',
                          'Vérification de la lance',
                          'Contrôle du raccordement au réseau d\'eau',
                          'Vérification des vannes et clapets',
                          'Ouverture du robinet',
                          'Contrôle du débit d’eau',
                          'Test de la lance et du jet',
                          'Graissage des pièces mobiles',
                          'Vérification des joints et filtres',
                          'Vérification des éléments de signalisation',
                        ].map((task, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="p-3">{task}</td>
                            <td className="p-3">
                              <div className="flex space-x-4">
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    name={`statut-ria-${idx}`}
                                    className="form-radio text-green-600"
                                  />
                                  <span className="ml-2">Valide</span>
                                </label>
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    name={`statut-ria-${idx}`}
                                    className="form-radio text-red-600"
                                  />
                                  <span className="ml-2">Non valide</span>
                                </label>
                              </div>
                            </td>
                            <td className="p-3">
                              <textarea
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows={3}
                                placeholder="Entrez vos observations pour cette tâche"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}