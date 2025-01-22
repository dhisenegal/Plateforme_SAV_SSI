import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ModifierMaintenanceDialog = ({
  isOpen,
  onClose,
  maintenance,
  techniciens,
  onSubmit
}) => {
  const [formData, setFormData] = React.useState({
    datePlanifiee: '',
    description: '',
    idTechnicien: '',
    commentaireModification: ''
  });

  React.useEffect(() => {
    if (maintenance) {
      setFormData({
        datePlanifiee: new Date(maintenance.datePlanifiee).toISOString().split('T')[0],
        description: maintenance.description,
        idTechnicien: maintenance.idTechnicien.toString(),
        commentaireModification: ''
      });
    }
  }, [maintenance]);

  const handleSubmit = async () => {
    if (!formData.commentaireModification.trim()) {
      alert('Veuillez ajouter un commentaire justificatif pour la modification');
      return;
    }
    
    await onSubmit(formData);
    onClose();
  };

  if (!maintenance) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier la maintenance {maintenance.numero}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div>
            <label className="block mb-2">Date planifiée</label>
            <Input
              type="date"
              value={formData.datePlanifiee}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                datePlanifiee: e.target.value 
              }))}
            />
          </div>

          <div>
            <label className="block mb-2">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                description: e.target.value 
              }))}
            />
          </div>

          <div>
            <label className="block mb-2">Technicien</label>
            <Select 
              value={formData.idTechnicien}
              onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                idTechnicien: value 
              }))}
            >
              <SelectTrigger>
                Sélectionner un technicien
              </SelectTrigger>
              <SelectContent>
                {techniciens.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id.toString()}>
                    {`${tech.prenom} ${tech.nom}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2">Commentaire justificatif</label>
            <Textarea
              value={formData.commentaireModification}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                commentaireModification: e.target.value 
              }))}
              placeholder="Veuillez justifier la modification du planning..."
              className="h-24"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Enregistrer les modifications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModifierMaintenanceDialog;