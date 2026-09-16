/**
 * Generates clean, standalone, runnable Python code with Pygame
 * rendering the exact yellow flowers landscape at warm dusk with falling petals.
 */

export function generatePygameScript(recipientName: string, message: string): string {
  const safeName = recipientName.replace(/"/g, '\\"');
  const safeMessage = message.replace(/"/g, '\\"').replace(/\n/g, ' - ');

  return `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
====================================================================
  💛 PAISAJE DE FLORES AMARILLAS AL ANOCHECER - DETALLE DE AMOR 💛
  Dedicado con todo mi cariño para: ${safeName}
====================================================================
Requisitos:
  pip install pygame

Ejecución:
  python flores_amarillas.py

Controles:
  - [ESPACIO] : Ocultar / Mostrar carta de amor
  - [F]       : Alternar Pantalla Completa
  - [FLECHAS] : Arriba/Abajo para cambiar la hora (Atardecer a Anochecer)
  - [ESC]     : Salir
"""

import pygame
import math
import random
import sys

# -------------------------------------------------------------
# CONFIGURACIÓN GENERAL
# -------------------------------------------------------------
WIDTH, HEIGHT = 1280, 720
FPS = 60
TITLE = "💛 Flores Amarillas para ${safeName} 💛"
MESSAGE = "${safeMessage}"

pygame.init()
pygame.font.init()
pygame.display.set_caption(TITLE)

screen = pygame.display.set_mode((WIDTH, HEIGHT), pygame.RESIZABLE)
clock = pygame.time.Clock()

# Fuentes
try:
    font_title = pygame.font.SysFont("georgia", 34, bold=True)
    font_msg = pygame.font.SysFont("georgia", 20, italic=True)
    font_small = pygame.font.SysFont("sans-serif", 14)
except Exception:
    font_title = pygame.font.Font(None, 40)
    font_msg = pygame.font.Font(None, 24)
    font_small = pygame.font.Font(None, 18)

# -------------------------------------------------------------
# PALETAS DE COLOR (DEGRADADO DEL CIELO Y ELEMENTOS)
# -------------------------------------------------------------
# Colores cielo atardecer/anochecer cálido
# Arriba: violeta nocturno -> Medio: magenta cálido -> Horizonte: ámbar dorado
SKY_TOP_NIGHT = (24, 18, 48)
SKY_MID_DUSK = (156, 52, 78)
SKY_HORIZON_WARM = (245, 142, 60)
SKY_SUN_GLOW = (255, 205, 120)

# Colores de flores amarillas
YELLOW_PETAL_MAIN = (255, 215, 0)
YELLOW_PETAL_LIGHT = (255, 238, 88)
YELLOW_PETAL_WARM = (255, 179, 0)
FLOWER_CENTER = (94, 48, 16)
FLOWER_CENTER_LIGHT = (140, 78, 28)
STEM_GREEN = (46, 89, 38)
STEM_DARK = (28, 56, 24)

# -------------------------------------------------------------
# CLASES DE ELEMENTOS: PÉTALOS, FLORES, ESTRELLAS, LUCIÉRNAGAS
# -------------------------------------------------------------
class Star:
    def __init__(self, w, h):
        self.x = random.randint(0, w)
        self.y = random.randint(0, int(h * 0.45))
        self.size = random.uniform(1.0, 2.5)
        self.phase = random.uniform(0, math.pi * 2)
        self.speed = random.uniform(1.5, 3.5)

    def draw(self, surface, t):
        alpha = int(120 + 135 * (0.5 + 0.5 * math.sin(t * self.speed + self.phase)))
        star_surf = pygame.Surface((int(self.size * 2), int(self.size * 2)), pygame.SRCALPHA)
        pygame.draw.circle(star_surf, (255, 245, 200, alpha), (int(self.size), int(self.size)), int(self.size))
        surface.blit(star_surf, (self.x - self.size, self.y - self.size))

class FallingPetal:
    def __init__(self, w, h, initial=False):
        self.w = w
        self.h = h
        self.reset(initial)

    def reset(self, initial=False):
        self.x = random.uniform(0, self.w + 100)
        self.y = random.uniform(-50, self.h) if initial else random.uniform(-80, -10)
        self.z = random.uniform(0.6, 1.3)
        self.base_vy = random.uniform(1.0, 2.2) * self.z
        self.vx = random.uniform(-0.5, 1.2) * self.z
        self.angle = random.uniform(0, math.pi * 2)
        self.v_rot = random.uniform(0.02, 0.05)
        self.flutter_phase = random.uniform(0, math.pi * 2)
        self.flutter_speed = random.uniform(1.8, 3.2)
        self.length = random.uniform(14, 22) * self.z
        self.width = self.length * 0.5
        self.color = random.choice([YELLOW_PETAL_MAIN, YELLOW_PETAL_LIGHT, YELLOW_PETAL_WARM])
        self.alpha = int(random.uniform(200, 245))

    def update(self, wind_factor):
        self.flutter_phase += self.flutter_speed * 0.03
        self.angle += self.v_rot
        wobble = math.sin(self.flutter_phase) * 1.5

        self.x += (self.vx + wind_factor * 1.8 + wobble)
        self.y += self.base_vy

        if self.y > self.h + 50 or self.x < -100 or self.x > self.w + 150:
            self.reset(False)

    def draw(self, surface):
        # Efecto 3D de pétalo girando en el aire (ancho comprimido por coseno)
        scale_w = abs(math.cos(self.flutter_phase)) * self.width
        if scale_w < 2:
            scale_w = 2

        surf = pygame.Surface((int(self.length * 2), int(self.length * 2)), pygame.SRCALPHA)
        cx, cy = int(self.length), int(self.length)
        rect = pygame.Rect(cx - scale_w, cy - self.length, int(scale_w * 2), int(self.length * 2))

        # Color cálido con transparencia
        col = (self.color[0], self.color[1], self.color[2], self.alpha)
        pygame.draw.ellipse(surf, col, rect)

        # Resaltado sutil en el borde
        inner_rect = pygame.Rect(cx - scale_w * 0.6, cy - self.length * 0.8, int(scale_w * 1.2), int(self.length * 1.4))
        pygame.draw.ellipse(surf, (255, 255, 200, int(self.alpha * 0.6)), inner_rect)

        # Rotar y pintar
        rotated = pygame.transform.rotate(surf, math.degrees(self.angle))
        new_rect = rotated.get_rect(center=(int(self.x), int(self.y)))
        surface.blit(rotated, new_rect.topleft)

class YellowFlower:
    def __init__(self, x, base_y, stem_len, head_r, petal_count, layer):
        self.x = x
        self.base_y = base_y
        self.stem_len = stem_len
        self.head_r = head_r
        self.petal_count = petal_count
        self.petal_len = head_r * 2.2
        self.layer = layer
        self.phase = random.uniform(0, math.pi * 2)
        self.flex = random.uniform(0.7, 1.3)
        self.color = random.choice([YELLOW_PETAL_MAIN, YELLOW_PETAL_LIGHT, YELLOW_PETAL_WARM])

    def draw(self, surface, t, wind_intensity):
        # Movimiento suave y natural con el viento cálido
        sway = math.sin(t * 1.5 + self.phase) * (14 * self.flex * wind_intensity)
        head_x = self.x + sway
        head_y = self.base_y - self.stem_len + abs(sway) * 0.15

        # Control point para tallo curvado con Bezier cuadrático
        ctrl_x = self.x + sway * 0.35
        ctrl_y = self.base_y - self.stem_len * 0.55

        # Tallo
        points = []
        steps = 14
        for i in range(steps + 1):
            s = i / steps
            # B(s) = (1-s)^2 P0 + 2(1-s)s P1 + s^2 P2
            px = (1 - s)**2 * self.x + 2 * (1 - s) * s * ctrl_x + s**2 * head_x
            py = (1 - s)**2 * self.base_y + 2 * (1 - s) * s * ctrl_y + s**2 * head_y
            points.append((int(px), int(py)))

        stem_thick = 3 if self.layer == 2 else 2
        pygame.draw.lines(surface, STEM_GREEN if self.layer == 2 else STEM_DARK, False, points, stem_thick)

        # Pétalos amarillos en capas
        angle_step = (math.pi * 2) / self.petal_count
        for layer_pass in (0, 1):
            p_len = self.petal_len * (0.85 if layer_pass == 0 else 1.0)
            offset_angle = (angle_step * 0.5 if layer_pass == 0 else 0) + (sway * 0.02)
            for i in range(self.petal_count):
                ang = i * angle_step + offset_angle
                cos_a, sin_a = math.cos(ang), math.sin(ang)

                tip_x = head_x + cos_a * p_len
                tip_y = head_y + sin_a * p_len
                perp_x = -sin_a * (self.head_r * 0.55)
                perp_y = cos_a * (self.head_r * 0.55)
                mid_x = head_x + cos_a * (p_len * 0.5)
                mid_y = head_y + sin_a * (p_len * 0.5)

                poly = [
                    (int(head_x), int(head_y)),
                    (int(mid_x + perp_x), int(mid_y + perp_y)),
                    (int(tip_x), int(tip_y)),
                    (int(mid_x - perp_x), int(mid_y - perp_y)),
                ]
                col = YELLOW_PETAL_WARM if layer_pass == 0 else self.color
                pygame.draw.polygon(surface, col, poly)

        # Centro de la flor (disco marrón cálido con textura)
        pygame.draw.circle(surface, FLOWER_CENTER, (int(head_x), int(head_y)), int(self.head_r))
        pygame.draw.circle(surface, FLOWER_CENTER_LIGHT, (int(head_x), int(head_y)), int(self.head_r * 0.65))

class Firefly:
    def __init__(self, w, h):
        self.w = w
        self.h = h
        self.x = random.uniform(0, w)
        self.y = random.uniform(h * 0.45, h * 0.9)
        self.base_y = self.y
        self.speed_x = random.uniform(-0.6, 0.6)
        self.phase = random.uniform(0, math.pi * 2)
        self.pulse_speed = random.uniform(1.5, 3.0)
        self.size = random.uniform(2.5, 4.5)

    def update(self, t):
        self.x += self.speed_x
        self.y = self.base_y + math.sin(t * 1.8 + self.phase) * 20
        if self.x < -20: self.x = self.w + 20
        elif self.x > self.w + 20: self.x = -20

    def draw(self, surface, t):
        brightness = (math.sin(t * self.pulse_speed + self.phase) + 1.0) * 0.5
        if brightness < 0.1: return

        glow_r = int(self.size * (2.5 + brightness * 2.0))
        glow_surf = pygame.Surface((glow_r * 2, glow_r * 2), pygame.SRCALPHA)
        alpha = int(brightness * 180)

        # Halo suave
        pygame.draw.circle(glow_surf, (255, 230, 100, int(alpha * 0.35)), (glow_r, glow_r), glow_r)
        # Núcleo brillante
        pygame.draw.circle(glow_surf, (255, 255, 180, alpha), (glow_r, glow_r), int(self.size))

        surface.blit(glow_surf, (int(self.x - glow_r), int(self.y - glow_r)))

# -------------------------------------------------------------
# FUNCIÓN PARA RENDERIZAR EL CIELO EN DEGRADADO AL ANOCHECER
# -------------------------------------------------------------
def create_sky_gradient(w, h, dusk_factor=0.65):
    """
    Crea un degradado vertical de alta fidelidad:
    Casi haciéndose noche con tonos violeta nocturno, magenta crepuscular y resplandor dorado.
    """
    sky_surf = pygame.Surface((w, h))

    # Interpolaciones según dusk_factor (0: atardecer brillante, 1: noche profunda)
    c_top = (
        int(SKY_TOP_NIGHT[0] * (0.7 + 0.3 * dusk_factor)),
        int(SKY_TOP_NIGHT[1] * (0.7 + 0.3 * dusk_factor)),
        int(SKY_TOP_NIGHT[2] * (0.8 + 0.2 * dusk_factor)),
    )
    c_mid = (
        int(SKY_MID_DUSK[0] * (1.1 - 0.3 * dusk_factor)),
        int(SKY_MID_DUSK[1] * (1.0 - 0.2 * dusk_factor)),
        int(SKY_MID_DUSK[2] * (1.0 - 0.2 * dusk_factor)),
    )
    c_bottom = (
        int(SKY_HORIZON_WARM[0] * (1.0 - 0.2 * dusk_factor)),
        int(SKY_HORIZON_WARM[1] * (0.9 - 0.3 * dusk_factor)),
        int(SKY_HORIZON_WARM[2] * (0.8 - 0.4 * dusk_factor)),
    )

    h_mid = int(h * 0.55)
    for y in range(h):
        if y < h_mid:
            ratio = y / h_mid
            r = int(c_top[0] * (1 - ratio) + c_mid[0] * ratio)
            g = int(c_top[1] * (1 - ratio) + c_mid[1] * ratio)
            b = int(c_top[2] * (1 - ratio) + c_mid[2] * ratio)
        else:
            ratio = (y - h_mid) / (h - h_mid)
            r = int(c_mid[0] * (1 - ratio) + c_bottom[0] * ratio)
            g = int(c_mid[1] * (1 - ratio) + c_bottom[1] * ratio)
            b = int(c_mid[2] * (1 - ratio) + c_bottom[2] * ratio)
        pygame.draw.line(sky_surf, (r, g, b), (0, y), (w, y))

    # Resplandor suave del sol ocultándose en el horizonte
    sun_glow = pygame.Surface((w, h), pygame.SRCALPHA)
    sun_x, sun_y = int(w * 0.5), int(h * 0.62)
    for radius in range(240, 20, -20):
        a = int((1.0 - radius / 240) * 75 * (1.0 - dusk_factor * 0.4))
        pygame.draw.circle(sun_glow, (SKY_SUN_GLOW[0], SKY_SUN_GLOW[1], SKY_SUN_GLOW[2], a), (sun_x, sun_y), radius)

    sky_surf.blit(sun_glow, (0, 0))
    return sky_surf

# -------------------------------------------------------------
# COLINAS / RELIEVE DEL PAISAJE
# -------------------------------------------------------------
def draw_hills(surface, w, h, t):
    # Colina lejana
    pts_far = [(0, h)]
    for x in range(0, w + 30, 30):
        y = h * 0.58 + math.sin(x * 0.003 + 0.5) * 45 + math.cos(x * 0.006) * 15
        pts_far.append((x, int(y)))
    pts_far.append((w, h))
    pygame.draw.polygon(surface, (54, 40, 48), pts_far)

    # Colina media
    pts_mid = [(0, h)]
    for x in range(0, w + 20, 20):
        y = h * 0.68 + math.sin(x * 0.004 + 2.0) * 40 + math.cos(x * 0.008) * 20
        pts_mid.append((x, int(y)))
    pts_mid.append((w, h))
    pygame.draw.polygon(surface, (36, 48, 30), pts_mid)

    # Suelo principal de primer plano
    pts_fore = [(0, h)]
    for x in range(0, w + 15, 15):
        y = h * 0.78 + math.sin(x * 0.005 + 4.0) * 30
        pts_fore.append((x, int(y)))
    pts_fore.append((w, h))
    pygame.draw.polygon(surface, (20, 32, 16), pts_fore)

# -------------------------------------------------------------
# DIBUJAR CARTA O DEDICATORIA ROMÁNTICA
# -------------------------------------------------------------
def draw_dedication_card(surface, w, h):
    card_w = min(int(w * 0.75), 680)
    card_h = 135
    card_x = (w - card_w) // 2
    card_y = int(h * 0.08)

    card_surf = pygame.Surface((card_w, card_h), pygame.SRCALPHA)
    # Fondo semi-transparente cálido con borde dorado
    pygame.draw.rect(card_surf, (22, 16, 28, 200), (0, 0, card_w, card_h), border_radius=16)
    pygame.draw.rect(card_surf, (255, 215, 0, 160), (0, 0, card_w, card_h), width=2, border_radius=16)

    surface.blit(card_surf, (card_x, card_y))

    # Título para ella
    title_text = f"💛 Para mi niña hermosa, ${safeName} 💛"
    txt_surf_shadow = font_title.render(title_text, True, (20, 10, 10))
    txt_surf = font_title.render(title_text, True, (255, 230, 110))
    surface.blit(txt_surf_shadow, (card_x + (card_w - txt_surf.get_width()) // 2 + 2, card_y + 18 + 2))
    surface.blit(txt_surf, (card_x + (card_w - txt_surf.get_width()) // 2, card_y + 18))

    # Mensaje romántico
    msg_surf = font_msg.render(MESSAGE, True, (250, 240, 220))
    surface.blit(msg_surf, (card_x + (card_w - msg_surf.get_width()) // 2, card_y + 68))

    # Pista pequeña
    hint_surf = font_small.render("[Espacio]: Ocultar carta  |  [F]: Pantalla Completa  |  [ESC]: Salir", True, (200, 180, 140))
    surface.blit(hint_surf, (card_x + (card_w - hint_surf.get_width()) // 2, card_y + 104))

# -------------------------------------------------------------
# INICIALIZACIÓN DE ELEMENTOS
# -------------------------------------------------------------
stars = [Star(WIDTH, HEIGHT) for _ in range(75)]
petals = [FallingPetal(WIDTH, HEIGHT, initial=True) for _ in range(85)]
fireflies = [Firefly(WIDTH, HEIGHT) for _ in range(35)]

# Generar campo de flores amarillas en tres capas de profundidad
flowers = []
# Capa trasera (flores lejanas más pequeñas)
for _ in range(45):
    fx = random.uniform(20, WIDTH - 20)
    base_y = random.uniform(HEIGHT * 0.72, HEIGHT * 0.82)
    flowers.append(YellowFlower(fx, base_y, stem_len=random.uniform(50, 85), head_r=random.uniform(7, 10), petal_count=10, layer=0))

# Capa media
for _ in range(55):
    fx = random.uniform(10, WIDTH - 10)
    base_y = random.uniform(HEIGHT * 0.80, HEIGHT * 0.92)
    flowers.append(YellowFlower(fx, base_y, stem_len=random.uniform(80, 125), head_r=random.uniform(10, 14), petal_count=12, layer=1))

# Capa frontal (girasoles y flores grandes en primer plano)
for _ in range(30):
    fx = random.uniform(5, WIDTH - 5)
    base_y = random.uniform(HEIGHT * 0.90, HEIGHT + 20)
    flowers.append(YellowFlower(fx, base_y, stem_len=random.uniform(120, 180), head_r=random.uniform(15, 20), petal_count=14, layer=2))

# Ordenar por layer y baseY para profundidad visual correcta
flowers.sort(key=lambda f: (f.layer, f.base_y))

# -------------------------------------------------------------
# BUCLE PRINCIPAL
# -------------------------------------------------------------
sky_cache = create_sky_gradient(WIDTH, HEIGHT, 0.65)
show_card = True
fullscreen = False
dusk_level = 0.65
time_sec = 0.0

running = True
while running:
    dt = clock.tick(FPS) / 1000.0
    time_sec += dt

    # Eventos de teclado y ventana
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                running = False
            elif event.key == pygame.K_SPACE:
                show_card = not show_card
            elif event.key == pygame.K_f:
                fullscreen = not fullscreen
                if fullscreen:
                    screen = pygame.display.set_mode((0, 0), pygame.FULLSCREEN)
                else:
                    screen = pygame.display.set_mode((WIDTH, HEIGHT), pygame.RESIZABLE)
                WIDTH, HEIGHT = screen.get_size()
                sky_cache = create_sky_gradient(WIDTH, HEIGHT, dusk_level)
            elif event.key == pygame.K_UP:
                dusk_level = max(0.2, dusk_level - 0.08)
                sky_cache = create_sky_gradient(WIDTH, HEIGHT, dusk_level)
            elif event.key == pygame.K_DOWN:
                dusk_level = min(0.95, dusk_level + 0.08)
                sky_cache = create_sky_gradient(WIDTH, HEIGHT, dusk_level)
        elif event.type == pygame.VIDEORESIZE and not fullscreen:
            WIDTH, HEIGHT = event.w, event.h
            screen = pygame.display.set_mode((WIDTH, HEIGHT), pygame.RESIZABLE)
            sky_cache = create_sky_gradient(WIDTH, HEIGHT, dusk_level)

    # Viento dinámico suave
    wind = 0.5 + 0.4 * math.sin(time_sec * 0.8) + 0.2 * math.cos(time_sec * 1.7)

    # 1. Pintar fondo: Degradado de cielo al anochecer
    screen.blit(sky_cache, (0, 0))

    # 2. Estrellas titilantes en el cielo crepuscular
    for star in stars:
        star.draw(screen, time_sec)

    # 3. Colinas y relieve cálido
    draw_hills(screen, WIDTH, HEIGHT, time_sec)

    # 4. Flores amarillas meciéndose suavemente
    for flower in flowers:
        flower.draw(screen, time_sec, wind)

    # 5. Luciérnagas doradas flotando
    for f in fireflies:
        f.update(time_sec)
        f.draw(screen, time_sec)

    # 6. Lluvia de pétalos cayendo lentamente
    for petal in petals:
        petal.update(wind)
        petal.draw(screen)

    # 7. Carta o dedicatoria
    if show_card:
        draw_dedication_card(screen, WIDTH, HEIGHT)

    pygame.display.flip()

pygame.quit()
sys.exit()
`;
}
