import "../index.css"

export default function CGV() {
    return (
        <main className="cgv-page">
            <div className="cgv-background">
                <h1 className="cgv-title">Conditions Générales de Vente</h1>
                
                <div className="cgv-section">
                    <p className="cgv-default-text"> Dernière mise à jour : {new Date().toLocaleDateString('fr-FR') }</p>

                    <section className="cgv-section">
                        <h2 className="cgv-section-title">Article 1 : Champ d'application</h2>
                        <div className="cgv-section-content">
                            <p>Les présentes Conditions Générales de Vente (CGV) s'appliquent, sans restriction ni réserve,
                            à l'ensemble des ventes conclues sur le site [www.votresite.fr] par :</p>
                            <p> Le Bihan Jean-Pierre, entrepreneur individuel (micro entreprise) </p>
                            <p> Activité : gravure personnalisée (bois/contreplaqué), impression 3D, découpe et articles créatifs </p>
                            <p> Adresse : 8 route de pont croix 29100 Pouldergat </p>
                            <p>SIRET : 108 048 497 00011 </p>
                            <p>E-mail : gravelya.studio@outlook.fr </p>
                            <p>TVA non applicable, art. 293 B du Code général des impôts </p>
                            <p>Ci-après "le Vendeur", auprès de tout consommateur particulier, ci-après "le Client", souhaitant procéder à un achat via le site internet du Vendeur.</p>
                            <p>Le Client déclare avoir pris connaissance des présentes CGV et les avoir acceptées avant la passation de sa commande. La validation de la
                            commande vaut acceptation sans réserve des présentes CGV. </p>
                        </div>
                    </section>

                    <section className="cgv-section">
                        <h2 className="cgv-section-title">Article 2 : Produits</h2>
                        <div className="cgv-section-content">
                            <p>Les produits proposés sont des créations personnalisées ou en petite série : objets gravés au laser (bois, contreplaqué), pièces
                            imprimées en 3D, découpes et cartes personnalisées. </p>
                            <p>Chaque produit est présenté sur le site avec une description et un prix en euros TTC. Lesphotographies illustrant les produits n'ont pas
                            de valeur contractuelle, notamment pour les créations gravées ou imprimées en 3D dont l'aspect final peut légèrement varier (matière, teinte, finition).</p>
                            <p>Pour les créations personnalisées, le Client est seul responsable des informations, textes, images ou fichiers qu'il transmet au Vendeur
                            (orthographe, droits d'utilisation, etc.).</p>
                        </div>
                    </section>

                    <section className="cgv-section">
                        <h2 className="cgv-section-title">Article 3 : Prix</h2>
                        <div className="cgv-section-content">
                            <p>Les prix sont indiqués en euros, toutes taxes comprises (TVA non applicable, article 293 B du CGI). Ils ne comprennent pas les frais de
                            livraison, calculés et indiqués au Client avant la validation définitive de la commande.</p>
                            <p>Le Vendeur se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix figurant au catalogue le jour de la commande 
                            sera le seul applicable au Client.</p>
                        </div>
                    </section>

                    <section className="cgv-section">
                        <h2 className="cgv-section-title">Article 4 : Commandes</h2>
                        <div className="cgv-section-content">
                            <p>Le Client sélectionne les produits qu'il souhaite commander, renseigne le cas échéant les éléments de personnalisation demandés, puis valide 
                            son panier. La commande n'est définitive qu'après :</p>
                            <p>1. Acceptation des présentes CGV (case à cocher) ;</p>
                            <p>2. Paiement intégral du prix.</p>
                            <p>Un e-mail de confirmation récapitulant la commande est envoyé au Client après validation du paiement.</p>
                        </div>
                    </section>

                    <section className="cgv-section">
                        <h2 className="cgv-section-title">Article 5 : Paiement</h2>
                        <div className="cgv-section-content">
                            <p>Le paiement s'effectue en ligne, au moment de la commande, par carte bancaire via la solution sécurisée Stripe.</p>
                            <p>Les données bancaires transmises sont cryptées et ne transitent à aucun moment par le site du Vendeur.</p>
                        </div>
                    </section>

                    <section className="cgv-section">
                        <h2 className="cgv-section-title">Article 6 : Livraison</h2>
                        <div className="cgv-section-content">
                            <p>Les produits sont expédiés à l'adresse indiquée par le Client lors de la commande, via les transporteurs suivants : 
                            Mondial Relay, Colissimo ou Lettre Suivie, selon l'option choisie au moment de la commande.</p>
                            <p>Les délais de livraison sont communiqués à titre indicatif lors de la commande et n'incluent pas le délai de préparation/fabrication propre aux 
                            créations personnalisées.</p>
                            <p>En cas de retard de livraison significatif, le Client peut contacter le Vendeur à l'adresse e-mail indiquée à l'article 1.</p>
                        </div>
                    </section>

                    <section className="cgv-section">
                        <h2 className="cgv-section-title">Article 7 : Droit de rétractation</h2>
                        <div className="cgv-section-content">
                            <p>Conformément aux articles L.221-18 et suivants du Code de la consommation, le Client dispose d'un délai de 14 jours à compter de la réception 
                            du produit pour exercer son droit de rétractation, sans avoir à justifier de motif.</p>
                            <p>**Exception importante** : conformément à l'article L.221-28 du Code de la consommation, le droit de rétractation **ne s'applique pas** aux 
                            biens confectionnés selon les spécifications du Client ou nettement personnalisés (ex. : gravure personnalisée avec prénom, texte ou visuel fourni 
                            par le Client). Cette exclusion sera clairement rappelée au Client avant la validation de sa commande pour tout produit personnalisé.</p>
                            <p>Pour les produits non personnalisés, le Client informe le Vendeur de sa décision de rétractation par déclaration dénuée d'ambiguïté (e-mail) ou 
                            via le [formulaire type de rétractation](https://www.service-public.fr). Le remboursement intervient dans un délai de 14 jours suivant la réception 
                            du produit retourné, incluant les frais de livraison initiaux (hors frais de retour, à la charge du Client sauf produit défectueux).</p>
                            <p>Rappel : à défaut d'information correcte et complète du Client sur ce droit, le délai de rétractation est prolongé à 12 mois.</p>
                        </div>
                    </section>

                    <section className="cgv-section">
                        <h2 className="cgv-section-title">Article 8 : Garanties légales</h2>
                        <div className="cgv-section-content">
                            <p>Tous les produits fournis par le Vendeur bénéficient de plein droit et sans paiement complémentaire :</p>
                            <ul>
                                <li>de la garantie légale de conformité (articles L.217-3 et suivants du Code de la consommation), pour les défauts de conformité existants au moment de la délivrance du bien ;</li>
                                <li>de la garantie légale des vices cachés (articles 1641 et suivants du Code civil), pour les défauts cachés rendant le produit impropre à l'usage auquel il est destiné.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="cgv-section">
                        <h2 className="cgv-section-title">Article 9 : Propriété intellectuelle</h2>
                        <div className="cgv-section-content">
                            <p>Les créations, visuels, designs et modèles proposés par le Vendeur restent sa propriété intellectuelle. Toute reproduction ou exploitation commerciale sans autorisation est interdite.</p>
                            <p>Lorsque le Client fournit un fichier, une image ou un texte pour une personnalisation, il garantit détenir les droits nécessaires sur ces éléments et dégage le Vendeur de toute 
                            responsabilité en cas de litige lié aux droits d'auteur ou à la propriété intellectuelle d'un tiers.</p>
                        </div>
                    </section>

                    <section className="cgv-section">
                        <h2 className="cgv-section-title">Article 10 : Responsabilité</h2>
                        <div className="cgv-section-content">
                            <p>Le Vendeur ne saurait être tenu responsable de l'inexécution du contrat en cas de force majeure, de rupture de stock de matières premières, ou de fait imprévisible et insurmontable 
                            d'un tiers.</p>
                        </div>
                    </section>

                    <section className="cgv-section">
                        <h2 className="cgv-section-title">Article 11 : Médiation de la consommation</h2>
                        <div className="cgv-section-content">
                            <p>Conformément aux dispositions du Code de la consommation concernant le règlement amiable des litiges, le Vendeur adhère au service de médiation de la consommation 
                            [Nom du médiateur choisi, ex. CM2C].</p>
                            <p>En cas de litige, après démarche écrite préalable auprès du Vendeur, le Client peut déposer sa réclamation sur le site du médiateur : **[lien du médiateur]**, ou 
                            par voie postale à : **[adresse du médiateur]**.</p>
                        </div>
                    </section>

                    <section className="cgv-section">
                        <h2 className="cgv-section-title">Article 12 : Données personnelles</h2>
                        <div className="cgv-section-content">
                            <p>Les données personnelles collectées lors de la commande sont nécessaires au traitement de celle-ci et sont traitées conformément à la [Politique de confidentialité]
                            du site, dans le respect du RGPD. Le Client dispose d'un droit d'accès, de rectification et de suppression de ses données, exerçable par e-mail auprès du Vendeur.</p>
                        </div>
                    </section>

                    <section className="cgv-section">
                        <h2 className="cgv-section-title">Article 13 : Droit applicable et litiges</h2>
                        <div className="cgv-section-content">
                            <p>Les présentes CGV sont soumises au droit français. En cas de litige, et après échec de toute recherche de solution amiable ou de médiation, les tribunaux français 
                            seront seuls compétents.</p>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    )
}