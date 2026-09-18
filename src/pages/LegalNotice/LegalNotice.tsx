import "./legalnotice.css"

export default function LegalNotice() {
    return (
        <main className="legal-information-page">
            <div className="default-box-design">
                <h1 className="main-title">Mentions Légales</h1>
        
                <div className="legal-content">
                    <p className="legal-default-text default-text">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

                    <section className="legal-section">
                        <h2 className="legal-section-title sub-title">1. Éditeur du site</h2>
                        <div className="legal-section-content">
                            <p className="default-text">Le site Gravelya Studio est édité par :</p>
                            <p className="default-text">Le Bihan Jean-Pierre, entrepreneur individuel (EI), exerçant sous le nom commercial Gravelya Studio.</p>
                            <ul>
                                <li className="default-text">Statut : Entrepreneur individuel (EI) — micro-entreprise</li>
                                <li className="default-text">SIRET : 108 048 497 00011</li>
                                <li className="default-text">Adresse : 8 route de Pont-Croix, 29100 Pouldergat, France</li>
                                <li className="default-text">E-mail : gravelya.studio@outlook.fr</li>
                                <li className="default-text">TVA : TVA non applicable, article 293 B du Code général des impôts</li>
                            </ul>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title sub-title">2. Directeur de la publication</h2>
                        <div className="legal-section-content">
                            <p className="default-text">Le directeur de la publication du site est :</p>
                            <p className="default-text">Le Bihan Jean-Pierre</p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title sub-title">3. Hébergeur du site</h2>
                        <div className="legal-section-content">
                            <h3 className="low-title">3.1. Hébergement du front-end</h3>
                            <p className="default-text">L'interface du site est hébergée par :</p>
                            <ul>
                                <li className="default-text">Netlify, Inc.</li>
                                <li className="default-text">101 2nd Street</li>
                                <li className="default-text">San Francisco, CA 94105</li>
                                <li className="default-text">États-Unis</li>
                                <li className="default-text">Site web : https://www.netlify.com</li>
                            </ul>

                            <h3 className="low-title">3.2. Hébergement du back-end</h3>
                            <p className="default-text">Le back-end du site est hébergé par :</p>
                            <ul>
                                <li className="default-text">Render Services, Inc.</li>
                                <li className="default-text">525 Brannan St</li>
                                <li className="default-text">San Francisco, CA 94107</li>
                                <li className="default-text">États-Unis</li>
                                <li className="default-text">Site web : https://render.com</li>
                            </ul>

                            <h3 className="low-title">3.3. Hébergement de la base de données</h3>
                            <p className="default-text">La base de données du site est hébergée par :</p>
                            <ul>
                                <li className="default-text">Neon Inc.</li>
                                <li className="default-text">209 Orange Street</li>
                                <li className="default-text">City of Wilmington, County of New Castle, Delaware 19801</li>
                                <li className="default-text">États-Unis</li>
                                <li className="default-text">Site web : https://neon.com</li>
                            </ul>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title sub-title">4. Propriété intellectuelle</h2>
                        <div className="legal-section-content">
                            <p className="default-text">L'ensemble des contenus présents sur le site Gravelya Studio, notamment les textes, images, logos, créations, photographies, éléments graphiques et autres 
                            contenus, est la propriété exclusive de Le Bihan Jean-Pierre / Gravelya Studio, sauf mention contraire.</p>
                            <p className="default-text">Toute reproduction, représentation, modification, adaptation, distribution ou exploitation, totale ou partielle, de ces contenus, par quelque procédé que 
                            ce soit, sans l'autorisation préalable de leur titulaire, est interdite.</p>
                            <p className="default-text">Toute utilisation non autorisée des contenus du site est susceptible de constituer une contrefaçon sanctionnée par les dispositions du Code de la propriété 
                            intellectuelle.</p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title sub-title">5. Crédits photographiques</h2>
                        <div className="legal-section-content">
                            <p className="default-text">Les photographies et visuels présents sur le site sont réalisés par :</p>
                            <p className="default-text">Le Bihan Jean-Pierre / Gravelya Studio, sauf mention contraire.</p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title sub-title">6. Responsabilité</h2>
                        <div className="legal-section-content">
                            <p className="default-text">Gravelya Studio s'efforce de fournir sur le site des informations aussi précises et à jour que possible.</p>
                            <p className="default-text">Toutefois, l'éditeur ne saurait garantir l'exactitude, l'exhaustivité ou l'actualité de l'ensemble des informations publiées sur le site.</p>
                            <p className="default-text">L'éditeur ne pourra être tenu responsable des éventuelles erreurs, omissions ou indisponibilités temporaires du site, sous réserve des dispositions légales applicables.</p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title sub-title">7. Droit applicable et litiges</h2>
                        <div className="legal-section-content">
                            <p className="default-text">Les présentes mentions légales sont soumises au droit français.</p>
                            <p className="default-text">En cas de litige, les parties rechercheront prioritairement une solution amiable, sans préjudice des droits dont dispose le consommateur en vertu de la réglementation applicable.</p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title sub-title">8. Médiation de la consommation</h2>
                        <div className="legal-section-content">
                            <p className="default-text">Conformément aux dispositions du Code de la consommation relatives au règlement amiable des litiges de consommation, le consommateur peut, sous certaines conditions, recourir 
                            gratuitement au médiateur de la consommation dont relève le professionnel.</p>
                            <p className="default-text">Médiateur de la consommation</p>
                            <ul>
                                <li className="default-text">[Nom du médiateur à compléter]</li>
                                <li className="default-text">[Adresse à compléter]</li>
                                <li className="default-text">[Site internet du médiateur à compléter]</li>
                            </ul>
                            <p className="default-text">Les modalités de recours à la médiation sont également précisées dans les Conditions Générales de Vente du site.</p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title sub-title">9. Contact</h2>
                        <div className="legal-section-content">
                            <p className="default-text">Pour toute question concernant le site, son fonctionnement ou les présentes mentions légales, vous pouvez contacter Gravelya Studio à l'adresse suivante :</p>
                            <p className="default-text">gravelya.studio@outlook.fr</p>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    )
}