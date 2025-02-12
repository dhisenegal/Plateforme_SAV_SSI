import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
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
  const [isFetchingComments, setIsFetchingComments] = useState(false);

  useEffect(() => {
    if (isOpen && intervention?.id) {
      fetchComments();
    }
    // Réinitialiser le formulaire à l'ouverture
    setComment("");
  }, [isOpen, intervention]);

  const fetchComments = async () => {
    if (!intervention?.id) return;
    
    setIsFetchingComments(true);
    try {
      const fetchedComments = await getComments(intervention.id);
      setComments(fetchedComments);
    } catch (error) {
      toast.error("Erreur lors du chargement des commentaires");
      console.error("Erreur lors du chargement des commentaires:", error);
    } finally {
      setIsFetchingComments(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedComment = comment.trim();
    
    if (!trimmedComment) {
      toast.error("Le commentaire est requis");
      return;
    }

    if (requiredComment && trimmedComment.length < 10) {
      toast.error("Le commentaire doit contenir au moins 10 caractères");
      return;
    }

    setIsLoading(true);
    try {
      if (newStatus) {
        const result = await updateInterventionWithComment(
          intervention.id,
          newStatus,
          trimmedComment,
          currentUser
        );
        
        if (!result) throw new Error("Erreur lors de la mise à jour");
        
        toast.success("Statut mis à jour et commentaire ajouté avec succès");
      } else {
        const result = await addComment(
          intervention.id,
          trimmedComment,
          currentUser
        );
        
        if (!result) throw new Error("Erreur lors de l'ajout du commentaire");
        
        toast.success("Commentaire ajouté avec succès");
      }

      setComment("");
      await fetchComments();
      onCommentAdded();
      
      if (newStatus) {
        onClose();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      toast.error(error.message || "Erreur lors de l'ajout du commentaire");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setComment("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
              className="min-h-[100px] resize-y"
              disabled={isLoading}
            />
            {requiredComment && (
              <p className="text-sm text-gray-500">
                Le commentaire doit contenir au moins 10 caractères
              </p>
            )}
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                disabled={isLoading || !comment.trim() || (requiredComment && comment.trim().length < 10)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    En cours...
                  </>
                ) : "Envoyer"}
              </Button>
            </div>
          </form>

          <div className="mt-6 space-y-4">
            <h3 className="font-medium">Historique des commentaires</h3>
            {isFetchingComments ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div 
                    key={comment.id} 
                    className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-blue-600">
                        {comment.Utilisateur.prenom} {comment.Utilisateur.nom}
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(comment.dateCommentaire), "dd/MM/yyyy HH:mm", { locale: fr })}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-700 whitespace-pre-wrap">{comment.commentaire}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                Aucun commentaire pour cette intervention
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;