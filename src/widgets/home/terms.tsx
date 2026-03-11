import Link from "next/link";

export function Terms() {
  return (
    <section className="px-6 py-14 md:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-semibold text-foreground md:text-3xl">
          Términos de uso
        </h2>
        <p className="mt-4 text-center text-lg leading-relaxed text-muted-foreground">
          Última actualización: 12/03/2026
        </p>

        <div className="mt-12 space-y-10 text-lg leading-relaxed text-muted-foreground">
          <p>
            Estos términos regulan el acceso y uso del espacio digital asociado
            al proyecto{" "}
            <span className="font-semibold text-foreground">
              &ldquo;Volver a Preguntar&rdquo;
            </span>
            , creado por Guido Davies (en adelante, &ldquo;el proyecto&rdquo;).
          </p>
          <p>
            Al acceder o utilizar este espacio interactivo, el usuario acepta
            estos términos de uso.
          </p>

          <hr className="border-border" />

          {/* 1 */}
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              1. Naturaleza del servicio
            </h3>
            <p className="mt-3">
              El espacio interactivo disponible en este sitio tiene{" "}
              <span className="font-semibold text-foreground">
                fines educativos y de aprendizaje
              </span>
              .
            </p>
            <p className="mt-3">
              Su objetivo es ayudar a las personas a practicar cómo formular
              preguntas y comprender mejor el funcionamiento general de
              herramientas de inteligencia artificial.
            </p>
            <p className="mt-3">
              El uso del sistema es{" "}
              <span className="font-semibold text-foreground">voluntario</span>{" "}
              y está diseñado para un uso ocasional o educativo.
            </p>
          </div>

          <hr className="border-border" />

          {/* 2 */}
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              2. Uso educativo
            </h3>
            <p className="mt-3">
              La información generada por el sistema tiene{" "}
              <span className="font-semibold text-foreground">
                fines informativos y educativos
              </span>
              .
            </p>
            <p className="mt-3">
              Las respuestas producidas por el sistema no constituyen
              asesoramiento profesional de ningún tipo, incluyendo —pero no
              limitado a— asesoramiento legal, médico, financiero, técnico o
              psicológico.
            </p>
            <p className="mt-3">
              Los usuarios son responsables de evaluar la información recibida y
              de tomar decisiones basadas en múltiples fuentes cuando
              corresponda.
            </p>
          </div>

          <hr className="border-border" />

          {/* 3 */}
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              3. Uso de inteligencia artificial
            </h3>
            <p className="mt-3">
              Las respuestas proporcionadas en este espacio son generadas
              mediante sistemas de inteligencia artificial.
            </p>
            <p className="mt-3">
              Debido a la naturaleza de estas tecnologías, las respuestas pueden
              contener:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>errores</li>
              <li>imprecisiones</li>
              <li>información incompleta</li>
              <li>interpretaciones incorrectas de una pregunta</li>
            </ul>
            <p className="mt-3">
              Por esta razón, la información proporcionada debe considerarse{" "}
              <span className="font-semibold text-foreground">
                orientativa y educativa
              </span>
              , no definitiva.
            </p>
          </div>

          <hr className="border-border" />

          {/* 4 */}
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              4. Uso responsable
            </h3>
            <p className="mt-3">
              El usuario se compromete a utilizar este espacio de forma
              responsable.
            </p>
            <p className="mt-3">No está permitido utilizar el sistema para:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>realizar actividades ilegales</li>
              <li>
                compartir información personal sensible propia o de terceros
              </li>
              <li>difundir contenido ofensivo, abusivo o discriminatorio</li>
              <li>
                intentar manipular o abusar del funcionamiento del sistema
              </li>
            </ul>
            <p className="mt-3">
              El proyecto se reserva el derecho de limitar o modificar el acceso
              si detecta un uso inadecuado del servicio.
            </p>
          </div>

          <hr className="border-border" />

          {/* 5 */}
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              5. Privacidad y datos
            </h3>
            <p className="mt-3">
              Este espacio está diseñado para funcionar{" "}
              <span className="font-semibold text-foreground">
                sin requerir registro ni recopilación de datos personales
                identificables
              </span>
              .
            </p>
            <p className="mt-3">
              Los usuarios no deben compartir información sensible como:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>contraseñas</li>
              <li>datos financieros</li>
              <li>números de tarjetas</li>
              <li>información personal privada</li>
            </ul>
            <p className="mt-3">
              En caso de que el sistema detecte contenido potencialmente
              sensible, podrá advertir al usuario para evitar su exposición.
            </p>
            <p className="mt-3">
              Para más información, consultar la sección{" "}
              <Link
                href="/privacidad"
                className="font-semibold text-foreground underline underline-offset-4 transition-colors hover:text-primary"
              >
                Privacidad
              </Link>
              .
            </p>
          </div>

          <hr className="border-border" />

          {/* 6 */}
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              6. Limitación de responsabilidad
            </h3>
            <p className="mt-3">
              El uso de este espacio es responsabilidad del usuario.
            </p>
            <p className="mt-3">
              El autor del proyecto y cualquier persona asociada al mismo no
              serán responsables por:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>
                decisiones tomadas por los usuarios basadas en las respuestas
                generadas
              </li>
              <li>
                errores o imprecisiones en el contenido generado por
                inteligencia artificial
              </li>
              <li>
                interpretaciones incorrectas del contenido proporcionado
              </li>
            </ul>
            <p className="mt-3">
              El usuario acepta que este sistema es{" "}
              <span className="font-semibold text-foreground">
                una herramienta de aprendizaje
              </span>
              , no una fuente definitiva de información.
            </p>
          </div>

          <hr className="border-border" />

          {/* 7 */}
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              7. Disponibilidad del servicio
            </h3>
            <p className="mt-3">
              El funcionamiento del sistema puede modificarse, actualizarse o
              discontinuarse en cualquier momento sin previo aviso.
            </p>
            <p className="mt-3">
              Dado que se trata de un proyecto educativo en evolución, algunas
              funciones pueden cambiar con el tiempo.
            </p>
          </div>

          <hr className="border-border" />

          {/* 8 */}
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              8. Propiedad intelectual
            </h3>
            <p className="mt-3">
              El contenido del sitio, incluyendo textos, diseño y materiales
              asociados al proyecto{" "}
              <span className="font-semibold text-foreground">
                Volver a Preguntar
              </span>
              , se encuentra protegido por derechos de autor.
            </p>
            <p className="mt-3">
              El uso del contenido está permitido únicamente con fines
              personales y educativos.
            </p>
          </div>

          <hr className="border-border" />

          {/* 9 */}
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              9. Modificaciones de los términos
            </h3>
            <p className="mt-3">
              Estos términos pueden actualizarse periódicamente para reflejar
              mejoras en el proyecto o cambios en el funcionamiento del servicio.
            </p>
            <p className="mt-3">
              La versión vigente estará siempre disponible en esta página.
            </p>
          </div>

          <hr className="border-border" />

          {/* 10 */}
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              10. Contacto
            </h3>
            <p className="mt-3">
              Para consultas relacionadas con el funcionamiento del proyecto o
              estos términos de uso, puede contactarse a:
            </p>
            <p className="mt-3">
              <a
                href="mailto:hi@grays.vc"
                className="font-semibold text-foreground underline underline-offset-4 transition-colors hover:text-primary"
              >
                hi@grays.vc
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
