import { test, expect } from '@playwright/test';

test.describe('Navegação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve navegar entre páginas', async ({ page }) => {
    // Verifica se está na página inicial
    await expect(page).toHaveURL('/');
    
    // Navega para página de usuários
    await page.click('text=Usuários');
    await expect(page).toHaveURL(/.*usuarios/);
    
    // Navega para página de perfil
    await page.click('text=Perfil');
    await expect(page).toHaveURL(/.*perfil/);
    
    // Navega para página de permissões
    await page.click('text=Permissões');
    await expect(page).toHaveURL(/.*permissao/);
    
    // Volta para página inicial
    await page.click('text=Home');
    await expect(page).toHaveURL('/');
  });

  test('deve mostrar sidebar responsiva', async ({ page }) => {
    // Em desktop, sidebar deve estar visível
    await expect(page.locator('.sidebar')).toBeVisible();
    
    // Em mobile, testa toggle da sidebar
    await page.setViewportSize({ width: 768, height: 600 });
    
    // Verifica se sidebar está colapsada em mobile
    await expect(page.locator('.sidebar.collapsed')).toBeVisible();
    
    // Clica no botão de toggle
    await page.click('.sidebar-toggle');
    
    // Verifica se sidebar expandiu
    await expect(page.locator('.sidebar:not(.collapsed)')).toBeVisible();
  });

  test('deve mostrar breadcrumbs', async ({ page }) => {
    // Navega para uma página
    await page.click('text=Usuários');
    
    // Verifica se breadcrumbs estão presentes
    await expect(page.locator('.breadcrumbs')).toBeVisible();
    await expect(page.locator('.breadcrumbs')).toContainText('Usuários');
  });

  test('deve ter navegação por teclado', async ({ page }) => {
    // Testa navegação por Tab
    await page.keyboard.press('Tab');
    
    // Verifica se foco está no primeiro elemento navegável
    await expect(page.locator(':focus')).toBeVisible();
    
    // Testa navegação por Enter
    await page.keyboard.press('Enter');
    
    // Verifica se navegou para a página
    await expect(page).not.toHaveURL('/');
  });
}); 