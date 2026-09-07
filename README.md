# Rewear

PWA de moda circular: conecta empresas donantes, organizaciones sociales y personas para darle una segunda vida a la ropa.

Sitio estático, mobile-first, listo para [GitHub Pages](https://grupo-kiss.github.io/ReWear/).

## Recorrido

| Ruta | Pantalla |
| --- | --- |
| `index.html` | Onboarding — *Dale una segunda vida a la moda* |
| `home.html` | Inicio: donar, puntos e impacto |
| `donar.html` | Flujo de donación en 3 pasos |
| `solicitar.html` | Búsqueda y pedidos para organizaciones |
| `impacto.html` | Métricas y circuito circular |
| `design/moodboard.html` | Paleta, tipo e imágenes |
| `design/style-guide.html` | Componentes |

Los HTML originales de Stitch quedan en `design/stitch_mobile_first_web_app/`.

## Publicar en GitHub Pages

1. Subir este repositorio a `https://github.com/Grupo-Kiss/ReWear`.
2. En **Settings → Pages**, elegir *GitHub Actions* (el workflow `.github/workflows/pages.yml` despliega la raíz en cada push a `main`).
3. Alternativa: Source = *Deploy from a branch*, branch `main`, folder `/ (root)`.

Las rutas son relativas para que funcione en `https://grupo-kiss.github.io/ReWear/`.

## Desarrollo local

Servir la carpeta raíz (no abrir los HTML como `file://` si querés probar el service worker):

```powershell
python -m http.server 8080
```

Abrir `http://localhost:8080`.
