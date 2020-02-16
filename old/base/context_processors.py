from typing import List
import base64
import uuid


class CSPNonceGenerator:

    def __init__(self, request) -> None:
        self.request = request
        self.registry = []  # type: List[str]

    @property
    def nonce(self) -> str:
        data = base64.b64encode(uuid.uuid4().bytes).decode('utf8')
        nonce = "{}".format(data)
        self.registry.append(nonce)
        
        return nonce


def nonce(request):
    generator = CSPNonceGenerator(request)
    request._csp_nonce_generator = generator
    return {"csp_nonce": generator}
