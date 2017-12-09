import BaseService from './baseService'
import {Array1D, NDArrayMathGPU, Scalar} from 'deeplearn';

export default class NeuralService extends BaseService {
  constructor() {
    super()
  }

  // authenticatedRoute = (req, res, next) => {
  //   try {
  //     const idToken = this.getAuthToken(req)
  //     return this.authenticationService.isUserLoggedIn(idToken)
  //     .then(verification => {
  //       next()
  //     }).catch(err => {
  //       if(err.message.includes('token has expired')) {
  //         res.status(401).send({ message: 'Token has expired!' })
  //       } else {
  //         res.status(403).send({ message: 'Authentication failed!' })
  //       }
  //     })
  //   } catch(err) {
  //     console.error(`AuthenticationController.authenticatedRoute error: [${JSON.stringify(err)}]`)
  //     res.status(500).send({ error: err.message })
  //   }
  }
