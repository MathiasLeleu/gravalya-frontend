export default function LegalNotice() {
    return (
        <main className="legal-information-page">
            <div className="default-box-design">
                <h1 className="main-title">Mentions Légales</h1>
        
                <div className="legal-content">
                    <p className="default-text"> Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

                    <section className="legal-section">
                        <h2 className="legal-section-title">1. Éditeur du site</h2>
                        <div className="legal-section-content">
                            <p>Le site Gravelya Studio est édité par :</p>
                            <p>Le Bihan Jean-Pierre, entrepreneur individuel (EI), exerçant sous le nom commercial Gravelya Studio.</p>
                            <ul>
                                <li>Statut : Entrepreneur individuel (EI) — micro-entreprise</li>
                                <li>SIRET : 108 048 497 00011</li>
                                <li>Adresse : 8 route de Pont-Croix, 29100 Pouldergat, France</li>
                                <li>E-mail : gravelya.studio@outlook.fr</li>
                                <li>TVA : TVA non applicable, article 293 B du Code général des impôts</li>
                            </ul>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">2. Directeur de la publication</h2>
                        <div className="legal-section-content">
                            <p>Le directeur de la publication du site est :</p>
                            <p>Le Bihan Jean-Pierre</p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">3. Hébergeur du site</h2>
                        <div className="legal-section-content">
                            <h3>3.1. Hébergement du front-end</h3>
                            <p>L'interface du site est hébergée par :</p>
                            <ul>
                                <li>Netlify, Inc.</li>
                                <li>101 2nd Street</li>
                                <li>San Francisco, CA 94105</li>
                                <li>États-Unis</li>
                                <li>Site web : https://www.netlify.com</li>
                            </ul>

                            <h3>3.2. Hébergement du back-end</h3>
                            <p>Le back-end du site est hébergé par :</p>
                            <ul>
                                <li>Render Services, Inc.</li>
                                <li>525 Brannan St</li>
                                <li>San Francisco, CA 94107</li>
                                <li>États-Unis</li>
                                <li>Site web : https://render.com</li>
                            </ul>

                            <h3>3.3. Hébergement de la base de données</h3>
                            <p>La base de données du site est hébergée par :</p>
                            <ul>
                                <li>Neon Inc.</li>
                                <li>209 Orange Street</li>
                                <li>City of Wilmington, County of New Castle, Delaware 19801</li>
                                <li>États-Unis</li>
                                <li>Site web : https://neon.com</li>
                            </ul>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">4. Propriété intellectuelle</h2>
                        <div className="legal-section-content">
                            <p>L'ensemble des contenus présents sur le site Gravelya Studio, notamment les textes, images, logos, créations, photographies, éléments graphiques et autres 
                            contenus, est la propriété exclusive de Le Bihan Jean-Pierre / Gravelya Studio, sauf mention contraire.</p>
                            <p>Toute reproduction, représentation, modification, adaptation, distribution ou exploitation, totale ou partielle, de ces contenus, par quelque procédé que 
                            ce soit, sans l'autorisation préalable de leur titulaire, est interdite.</p>
                            <p>Toute utilisation non autorisée des contenus du site est susceptible de constituer une contrefaçon sanctionnée par les dispositions du Code de la propriété 
                            intellectuelle.</p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">5. Crédits photographiques</h2>
                        <div className="legal-section-content">
                            <p>Les photographies et visuels présents sur le site sont réalisés par :</p>
                            <p>Le Bihan Jean-Pierre / Gravelya Studio, sauf mention contraire.</p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">6. Responsabilité</h2>
                        <div className="legal-section-content">
                            <p>Gravelya Studio s'efforce de fournir sur le site des informations aussi précises et à jour que possible.</p>
                            <p>Toutefois, l'éditeur ne saurait garantir l'exactitude, l'exhaustivité ou l'actualité de l'ensemble des informations publiées sur le site.</p>
                            <p>L'éditeur ne pourra être tenu responsable des éventuelles erreurs, omissions ou indisponibilités temporaires du site, sous réserve des dispositions légales applicables.</p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">7. Droit applicable et litiges</h2>
                        <div className="legal-section-content">
                            <p>Les présentes mentions légales sont soumises au droit français.</p>
                            <p>En cas de litige, les parties rechercheront prioritairement une solution amiable, sans préjudice des droits dont dispose le consommateur en vertu de la réglementation applicable.</p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">8. Médiation de la consommation</h2>
                        <div className="legal-section-content">
                            <p>Conformément aux dispositions du Code de la consommation relatives au règlement amiable des litiges de consommation, le consommateur peut, sous certaines conditions, recourir 
                            gratuitement au médiateur de la consommation dont relève le professionnel.</p>
                            <p>Médiateur de la consommation</p>
                            <ul>
                                <li>[Nom du médiateur à compléter]</li>
                                <li>[Adresse à compléter]</li>
                                <li>[Site internet du médiateur à compléter]</li>
                            </ul>
                            <p>Les modalités de recours à la médiation sont également précisées dans les Conditions Générales de Vente du site.</p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">9. Contact</h2>
                        <div className="legal-section-content">
                            <p>Pour toute question concernant le site, son fonctionnement ou les présentes mentions légales, vous pouvez contacter Gravelya Studio à l'adresse suivante :</p>
                            <p>gravelya.studio@outlook.fr</p>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    )
}