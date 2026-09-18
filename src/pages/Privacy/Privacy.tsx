import "./privacy.css"

export default function Privacy() {
    return (
        <main className="privacy-page">
            <div className="privacy-background">
                <h1 className="page-main-title">Politique de Confidentialité</h1>

                <div className="privacy-section">
                    <p className="privacy-default-text"> Dernière mise à jour : {new Date().toLocaleDateString('fr-FR') }</p>

                    <section className="privacy-section-content">
                        <p>Gravelya Studio (Le Bihan Jean-Pierre, entrepreneur individuel, SIRET 108 048 497 00011) attache une grande importance à la protection de vos données personnelles. 
                        Cette politique explique quelles données sont collectées sur [www.votresite.fr], pourquoi, combien de temps elles sont conservées, et comment vous pouvez exercer vos droits.</p>
                        <h2 className="privacy-section-title">1. Responsable du traitement</h2>
                        <p>Le Bihan Jean-Pierre — Gravelya Studio</p>
                        <p>E-mail : gravelya.studio@outlook.fr</p>
                        <p>Adresse : 8 route de Pont-Croix, 29100 Pouldergat</p>
                    </section>

                    <section className="privacy-section-content">
                        <h2 className="privacy-section-title">2. Données collectées</h2>
                        <p>Selon votre utilisation du site, les données suivantes peuvent être collectées :</p>
                        <ul>
                            <li>Lors d'une commande : nom, prénom, adresse postale, adresse e-mail, numéro de téléphone (si demandé pour la livraison)</li>
                            <li>Lors d'un paiement : les données bancaires sont directement traitées par Stripe et ne transitent jamais par nos serveurs ni ne sont stockées par nos soins</li>
                            <li>Lors d'un contact (formulaire, e-mail) : nom, e-mail, contenu du message</li>
                            <li>Données de personnalisation : textes, visuels ou fichiers que vous transmettez pour vos créations sur mesure</li>
                            <li>Données de navigation : éventuels cookies techniques nécessaires au fonctionnement du site (panier, session)</li>
                        </ul>
                    </section>

                    <section className="privacy-section-content">
                        <h2 className="privacy-section-title">3. Finalités du traitement</h2>
                        <p>Vos données sont collectées pour :</p>
                        <ul>
                            <li>Traiter et livrer vos commandes</li>
                            <li>Communiquer avec vous concernant votre commande ou votre demande</li>
                            <li>Respecter nos obligations légales et comptables (facturation)</li>
                            <li>Améliorer le fonctionnement du site</li>
                        </ul>
                        <p>Aucune donnée n'est utilisée à des fins de prospection commerciale sans votre consentement explicite.</p>
                    </section>

                    <section className="privacy-section-content">
                        <h2 className="privacy-section-title">4. Base légale</h2>
                        <p>Le traitement de vos données repose sur :</p>
                        <ul>
                            <li>L'exécution du contrat (traitement de votre commande)</li>
                            <li>Votre consentement (newsletter, si applicable)</li>
                            <li>Nos obligations légales (conservation des factures)</li>
                        </ul>
                    </section>

                    <section className="privacy-section-content">
                        <h2 className="privacy-section-title">5. Destinataires des données</h2>
                        <p>Vos données sont traitées par Le Bihan Jean-Pierre / Gravelya Studio et transmises uniquement aux prestataires nécessaires à l'exécution du service :</p>
                        <ul>
                            <li>Stripe (traitement des paiements)</li>
                            <li>Sendcloud et les transporteurs partenaires — Mondial Relay, Colissimo, Lettre Suivie (traitement et livraison de votre commande)</li>
                            <li>Nos hébergeurs techniques (Netlify, Render, et la base de données Neon/Supabase)</li>
                        </ul>
                        <p>Aucune donnée n'est vendue ou cédée à des tiers à des fins commerciales.</p>
                    </section>

                    <section className="privacy-section-content">
                        <h2 className="privacy-section-title">6. Transferts de données hors Union européenne</h2>
                        <p>Certains de nos prestataires de services peuvent être amenés à traiter vos données personnelles en dehors de l'Union européenne, notamment aux États-Unis.</p>
                        <p>Lorsque de tels transferts ont lieu, ils sont encadrés conformément aux exigences du RGPD, notamment au moyen des garanties appropriées prévues par celui-ci :</p>
                        <ul>
                            <li>Stripe peut s'appuyer sur le Data Privacy Framework (DPF) UE-États-Unis ainsi que, lorsque nécessaire, sur les clauses contractuelles types (CCT) de la Commission européenne ;</li>
                            <li>Netlify peut s'appuyer sur les clauses contractuelles types (CCT) de la Commission européenne ainsi que, le cas échéant, sur le Data Privacy Framework (DPF) UE-États-Unis ;</li>
                            <li>Render s'appuie notamment sur les clauses contractuelles types (CCT) de la Commission européenne pour encadrer certains transferts internationaux de données ;</li>
                            <li>Neon s'appuie notamment sur les clauses contractuelles types (CCT) de la Commission européenne. La base de données utilisée pour le présent site est hébergée sur une infrastructure 
                                située dans l'Union européenne, à Francfort, en Allemagne.</li>
                        </ul>
                        <p>Les modalités de transfert et les garanties applicables peuvent évoluer en fonction des services utilisés et des évolutions réglementaires. Nous vous invitons à consulter régulièrement 
                            la présente politique de confidentialité afin de prendre connaissance des éventuelles modifications.</p>
                    </section>

                    <section className="privacy-section-content">
                        <h2 className="privacy-section-title">7. Durée de conservation</h2>
                        <ul>
                            <li>Données liées à la relation commerciale (compte, historique de commande, échanges) : conservées pendant la durée de la relation commerciale puis jusqu'à 3 ans après le dernier contact</li>
                            <li>Factures et pièces comptables : conservées 10 ans conformément aux obligations légales de conservation des documents comptables</li>
                            <li>Données de contact simple (sans commande) : conservées 3 ans maximum à compter du dernier échange</li>
                        </ul>
                    </section>

                    <section className="privacy-section-content">
                        <h2 className="privacy-section-title">8. Décision automatisée et profilage</h2>
                        <p>Aucune décision produisant des effets juridiques ou vous affectant de manière significative n'est prise à partir d'un traitement automatisé ou d'un profilage de vos données.</p>
                    </section>

                    <section className="privacy-section-content">
                        <h2 className="privacy-section-title">9. Vos droits</h2>
                        <p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez des droits suivants sur vos données :</p>
                        <ul>
                            <li>Droit d'accès</li>
                            <li>Droit de rectification</li>
                            <li>Droit à l'effacement (« droit à l'oubli »)</li>
                            <li>Droit à la limitation du traitement</li>
                            <li>Droit à la portabilité</li>
                            <li>Droit d'opposition</li>
                        </ul>
                        <p>Pour exercer l'un de ces droits, contactez-nous à : gravelya.studio@outlook.fr. Une preuve d'identité pourra vous être demandée en cas de doute raisonnable sur votre identité. Nous nous 
                            engageons à répondre dans un délai d'un mois à compter de la réception de votre demande, pouvant être porté à trois mois pour les demandes complexes.</p>
                        <p>Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) : www.cnil.fr</p>
                    </section>

                    <section className="privacy-section-content">
                        <h2 className="privacy-section-title">10. Sécurité des données</h2>
                        <p>Des mesures techniques et organisationnelles raisonnables sont mises en œuvre pour protéger vos données contre toute perte, accès non autorisé, divulgation ou altération.</p>
                    </section>

                    <section className="privacy-section-content">
                        <h2 className="privacy-section-title">11. Cookies</h2>
                        <p>Le site utilise uniquement des cookies techniques nécessaires à son fonctionnement (gestion du panier, de la session), pour lesquels votre consentement n'est pas requis. 
                            [À adapter si vous ajoutez des cookies analytiques ou publicitaires (Google Analytics, Meta Pixel, etc.) : dans ce cas, un bandeau de recueil du consentement devient obligatoire 
                            avant le dépôt de ces cookies, et cette section devra détailler chaque cookie, sa finalité et sa durée de conservation.]</p>
                    </section>

                    <section className="privacy-section-content">
                        <h2 className="privacy-section-title">12. Mineurs</h2>
                        <p>Le site n'est pas destiné aux personnes mineures. Si vous êtes mineur, nous vous invitons à obtenir l'accord d'un parent ou tuteur légal avant de transmettre des données 
                            personnelles sur ce site.</p>
                    </section>

                    <section className="privacy-section-content">
                        <h2 className="privacy-section-title">13. Contact</h2>
                        <p>Pour toute question relative à cette politique de confidentialité : gravelya.studio@outlook.fr</p>
                    </section>
                
                </div>
            </div>
        </main>
    )
}