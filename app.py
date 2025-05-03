from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)

@app.route('/container/<action>', methods=['POST'])
def control_container(action):
    print('ROTA /container/<action>')
    container_name = request.json.get('name')
    print('container_name:',container_name)

    if action not in ['start', 'stop', 'restart']:
        return jsonify({'error': 'Ação inválida'}), 400

    try:
        print(f'CMD: docker {action} {container_name}')
        subprocess.run(['docker', action, container_name], check=True)
        return jsonify({'status': f'{action} executado com sucesso'})
    except subprocess.CalledProcessError:
        return jsonify({'error': 'Erro ao executar comando Docker'}), 500

@app.route('/container/status/<name>', methods=['GET'])
def get_container_status(name):
    try:
        result = subprocess.check_output(['docker', 'inspect', '-f', '{{.State.Status}}', name])
        status = result.decode().strip()
        return jsonify({'status': status})
    except subprocess.CalledProcessError as e:
        return jsonify({'status': 'desconhecido'}), 404

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

