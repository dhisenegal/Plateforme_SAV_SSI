import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-toastify";
import { updateInterventionWithComment, addComment, getComments } from "@/actions/sav/intervention";

const CommentModal = ({ 
  isOpen, 
  onClose, 
  intervention, 
  onCommentAdded, 
  requiredComment = false,
  newStatus = null,
  currentUser
}) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && intervention?.id) {
      fetchComments();
    }
  }, [isOpen, intervention]);

  const fetchComments = async () => {
    if (!intervention?.id) return;
    
    try {
      const fetchedComments = await getComments(intervention.id);
      setComments(fetchedComments);
    } catch (error) {
      toast.error("Erreur lors du chargement des commentaires");
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Le commentaire est requis");
      return;
    }

    setIsLoading(true);
    try {
      if (newStatus) {
        // Mettre à jour le statut avec un commentaire
        await updateInterventionWithComment(
          intervention.id,
          newStatus,
          comment.trim(),
          currentUser.id
        );
      } else {
        // Ajouter simplement un commentaire
        await addComment(
          intervention.id,
          comment.trim(),
          currentUser.id
        );
        
      }

      toast.success("Commentaire ajouté avec succès");
      setComment("");
      await fetchComments(); // Rafraîchir la liste des commentaires
      onCommentAdded(); // Callback pour rafraîchir la liste des interventions
      if (newStatus) {
        onClose(); // Fermer la modal si c'était un changement de statut
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'ajout du commentaire");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {newStatus ? "Raison du changement de statut" : "Commentaires de l'intervention"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={newStatus 
                ? "Veuillez expliquer la raison du changement de statut..." 
                : "Ajouter un commentaire..."
              }
              required
              className="min-h-[100px]"
            />
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                disabled={isLoading || !comment.trim()}
              >
                {isLoading ? "En cours..." : "Envoyer"}
              </Button>
            </div>
          </form>

          {comments.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Historique des commentaires</h3>
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <span className="font-medium">
                        {comment.Utilisateur.prenom} {comment.Utilisateur.nom}
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(comment.dateCommentaire), "dd/MM/yyyy HH:mm", { locale: fr })}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-700">{comment.commentaire}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;