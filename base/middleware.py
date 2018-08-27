from django.utils.deprecation import MiddlewareMixin


class CSPNonceMiddleware(MiddlewareMixin):

    def process_response(self, request, response):

        generator = getattr(request, "_ff_csp_nonce_generator", None)

        if generator:
            nonce_collection = generator.registry
            response._csp_update = {
                "default-src": ["'nonce-{}'".format(x) for x in nonce_collection]
            }

        return response
