const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')


test('front page can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')

    const locator = await page.getByText('log in to application')
    await expect(locator).toBeVisible()
})

describe('Blog app', () => {
    test.describe.configure({ retries: 2 })

    beforeEach(async ({ page, request }) => {
        await request.post('http:localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                "username": "newUser",
                "name": "Cameron Ghahremani",
                "password": "maurice"
            }
        })

        await request.post('http://localhost:3003/api/users', {
            data: {
                "username": "otherUser",
                "name": "not Cameron Ghahremani",
                "password": "maurice"
            }
        })

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        const userForm = await page.getByTestId('username')
        const passwordForm = await page.getByTestId('password')

        expect(userForm).toBeVisible()
        expect(passwordForm).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'newUser', 'maurice')

            await expect(page.getByText('Cameron Ghahremani logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'newUser', 'wrong')

            const errorDiv = await page.locator('.error')

            await expect(errorDiv).toContainText('Wrong username or password')
        })
    })

    test('a new blog can be created by logged in user', async ({ page }) => {
        await loginWith(page, 'newUser', 'maurice')
        await createBlog(page, 'playwright testing blog', 'Cameron Ghahremani', 'playwright-testing.org')
        
        await expect(page.getByText('a new blog playwright testing blog by Cameron Ghahremani added!')).toBeVisible()
        await expect(page.getByText('playwright testing blog Cameron Ghahremani')).toBeVisible()
    })
    
    describe('when logged in and a blog has been created', () => {

        beforeEach(async ({ page }) => {
            await loginWith(page, 'newUser', 'maurice')
            await createBlog(page, 'testing editing and deletion', 'Cameron Ghahremani', 'playwright-testing.org')
            
        })


        test('a blog can be edited', async ({ page }) => {

            await page.getByRole('button', { name: 'show' }).click()
            await page.getByRole('button', { name: 'edit' }).first().click()
    
            await page.getByRole('textbox').fill('changed this title with playwright')
            await page.getByRole('button', { name: 'update' }).click()
            
            await expect(page.getByText('changed this title with playwright Cameron Ghahremani')).toBeVisible()
        })
    
        test('a blog can be deleted', async ({ page }) => {
            page.on('dialog', dialog => dialog.accept())
            await page.getByRole('button', { name: 'show' }).click()
            await page.getByRole('button', { name: 'remove' }).click()
    
            await expect(page.getByText('playwright testing blog Cameron Ghahremani')).not.toBeVisible()
        })
    
        test('the remove button is not visible to other users', async ({ page }) => {
            await page.getByRole('button', { name: 'logout' }).click()
            await loginWith(page, 'otherUser', 'maurice')
            await page.getByRole('button', { name: 'show' }).click()
            
            await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
            await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
        })

    })
    /*
    test('blogs are sorted by likes when page is refreshed', async ( {page }) => {
        await loginWith(page, 'newUser', 'maurice')
        await createBlog(page, 'like this blog thrice', 'Cameron Ghahremani', 'playwright-testing.org')
        await createBlog(page, 'like this blog twice', 'Cameron Ghahremani', 'playwright-testing.org')
        await createBlog(page, 'like this blog once', 'Cameron Ghahremani', 'playwright-testing.org')

        const showButtons = await page.getByRole('button', { name: 'show' }).all()


        await showButtons[0].click()
        for (let i = 0; i < 3; i++) {
            await page.getByRole('button', { name: 'like' }).click()
        }
        await page.getByRole('button', { name: 'hide' }).click()

        await showButtons[1].click()
        for (let i = 0; i < 2; i++) {
            await page.getByRole('button', { name: 'like' }).click()
        }
        await page.getByRole('button', { name: 'hide' }).click()

        await page.getByRole('button', { name: 'show' }).last().click()
        await page.getByRole('button', { name: 'like' }).click()

        await page.reload()

        const firstBlog = page.getByTestId('blog-header').first()

        await expect(firstBlog).toContainText('like this blog once')

        
    }*/
})

describe('seperated testing environment for sorted blogs', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http:localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                "username": "newUser",
                "name": "Cameron Ghahremani",
                "password": "maurice"
            }
        })

        await page.goto('http://localhost:5173')

        await loginWith(page, 'newUser', 'maurice')
        await createBlog(page, 'like this blog thrice', 'Cameron Ghahremani', 'playwright-testing.org')
        await createBlog(page, 'like this blog twice', 'Cameron Ghahremani', 'playwright-testing.org')
        await createBlog(page, 'like this blog once', 'Cameron Ghahremani', 'playwright-testing.org')
    })

    test('blogs are sorted by likes when page is refreshed', async ( {page }) => {
        

        const showButtons = await page.getByRole('button', { name: 'show' }).all()


        await showButtons[0].click()
        for (let i = 0; i < 3; i++) {
            await page.getByRole('button', { name: 'like' }).click()
        }
        await page.getByRole('button', { name: 'hide' }).click()

        
        await showButtons[1].click()
        for (let i = 0; i < 2; i++) {
            await page.getByRole('button', { name: 'like' }).click()
        }
        await page.getByRole('button', { name: 'hide' }).click()

        await page.getByRole('button', { name: 'show' }).last().click()
        await page.getByRole('button', { name: 'like' }).click()

        await page.reload()
        
        await expect(page.getByTestId('blog-header').first()).toContainText('like this blog once')
        await expect(page.getByTestId('blog-header').last()).toContainText('like this blog thrice')
        
    })
})
