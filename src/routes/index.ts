import { Router, Request, Response } from 'express';

import isAuth from '../middlwares/auth'
import { changeUserPassword } from '../controllers/auth'
import { validatePasswordChange } from '../middlwares/ValidateRoutes'
import { allPolicy } from '../controllers/policyController';
import { signupValidator } from '../middlwares/ValidateRoutes';
import { SignUp } from '../controllers/auth'
import { loginValidator } from '../middlwares/ValidateRoutes'
import { login } from '../controllers/auth'
import { createPolicy } from '../controllers/policyController'
import { validatePolicy } from '../middlwares/ValidateRoutes'
import { getUserPolicy } from '../controllers/policyController'
import { updateUserPolicy } from '../controllers/policyController'

const router = Router()


router.post('/signup', signupValidator, async (req: Request, res: Response) => {
    try {
        const token = await SignUp(req.body)
        await res.status(201).header('x-auth', token).json({
            'success': true,
            'message': 'created new user'
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            'success': false,
            'error': e.message
        })
    }

})

router.post('/login', loginValidator, async (req: Request, res: Response) => {
    try {
        const { email, password } = await req.body
        const token = await login(email, password)
        await res.header('x-auth', token)
            .status(200)
            .json({
                'success': true,
                'message': 'user signed in'
            })
    } catch (e) {
        res.status(400)
            .json({
                'success': false,
                'error': e.message
            })
    }
})


router.post('/changepassword', isAuth, validatePasswordChange, async (req: Request, res: Response) => {
    try {
        await changeUserPassword(req.params.id, req.body.oldPassword, req.body.newPassword)
        await res.status(200).json({
            'success': true,
            'message': 'Password updated successfully'
        })

    } catch (e) {
        res.status(400).json({
            'success': false,
            'error': e.message

        })
    }

})


router.get('/policies', async (req: Request, res: Response) => {
    try {
        const PolicyCount = await allPolicy();
        res.status(200).json({
            success: true,
            message: PolicyCount
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            error: e.message
        });
    }
});


router.post('/createpolicy', isAuth, validatePolicy, async (req: Request, res: Response) => {
    try {
        await createPolicy(req.params.id, req.body.policy)
        await res.status(201).json({
            'success': true,
            'message': 'created policy'
        })

    } catch (e) {
        res.status(500).json({
            'success': false,
            'error': e.message
        })
    }
})

router.get('/getpolicy', isAuth, async (req: Request, res: Response) => {
    try {
        const userPolicy = await getUserPolicy(req.params.id)
        await res.status(200).json({
            'success': true,
            'message': userPolicy
        })
    } catch (e) {
        res.status(400).json({
            'success': false,
            'error': e.message
        })
    }
})

router.patch('/updatepolicy', isAuth, validatePolicy, async (req: Request, res: Response) => {
    try {
        await updateUserPolicy(req.params.id, req.body.policy)
        await res.status(200).json({
            'success': true,
            'message': 'policies updated'
        })

    } catch (e) {
        res.status(500).json({
            'success': false,
            'error': e.message
        })
    }
})

export default router
