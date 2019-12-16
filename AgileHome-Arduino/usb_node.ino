#include <Keypad.h>
#include <LiquidCrystal.h>
LiquidCrystal lcd(31, 30, 25, 24, 23, 22);

const byte keypad_rows = 4; //Número de linhas do teclado
const byte keypad_cols = 3; //Número de colunas do teclado

char keys[keypad_rows][keypad_cols] = {
  {'1','2','3'},
  {'4','5','6'},
  {'7','8','9'},
  {'*','0','#'}
}; //Matriz de teclas
 
byte rowPins[keypad_rows] = {2,3,4,5}; //Pinos digitais das linhas
byte colPins[keypad_cols] = {6,7,8}; //Pinos digitais das colunas

Keypad keypad = Keypad(makeKeymap(keys),rowPins,colPins,keypad_rows,keypad_cols); //Cria o mapa do teclado para o Arduino

const byte pinRele = 9; //Pino do LED verde
 
char key; //Armazena um byte lido do teclado 
String input_password = ""; //Armazena a senha do usuário
char incoming_data = 0; //Armazena dados recebidos do NodeJS

//Definindo o tempo para executar cada função
#define Delay_receive 500
#define Delay_send 100

//Variaveis para calcular o tempo desde a última execução
int Tempo_receive = 0;
int Tempo_send = 0;

//Funções
void receive();
void send();


void setup()
{
  Serial.begin(9600);
  pinMode(pinRele, OUTPUT);
  lcd.begin(16, 2);
  lcd.clear();
}

void loop()
{   
    if(millis() - Tempo_send >=Delay_send)
      {
        send();
        Tempo_send=millis();
      }
      if(millis() - Tempo_receive >=Delay_receive)
      {
        receive();
        Tempo_receive=millis();
      } 
}

void receive(){
  lcd.clear();
  lcd.print("Agile Home");
  incoming_data = 0;
  if(Serial.available()) //Se há dados para serem lidos no barramento USB
  {
    incoming_data = (char)Serial.read(); //Armazena o byte lido do Serial como 'char'
    if(incoming_data == 'L'){
      digitalWrite(pinRele, HIGH);
      lcd.clear();
      lcd.setCursor(3, 0);
      lcd.print("Acesso");
      lcd.setCursor(3, 1);
      lcd.print("Liberado!");
      delay(2000);
      digitalWrite(pinRele, LOW);
      //Liberar Porta
    }
    Serial.flush(); //Limpa o buffer de dados do barramento Serial
  }
}

void send(){
  input_password = "";
  key = keypad.getKey(); //Lê do teclado
  if(key){
         while(true){
            if((key != NO_KEY) && (key != '*') && (key != '#')) //Verifica se é um número
            {
              input_password += key; //Concatena com a string da senha
            }
            else 
            {
              if(key == '*') //Tecla de correção, apaga toda a senha digitada
                input_password = "";
              else
                if(key == '#'){
                     key=EOF;
                      Serial.println(input_password);
                     return false;
                  } //Tecla confirma, envia os dados para o Serial, onde o Node faz a leitura
          }
          key = keypad.getKey(); //Lê do teclado
      }
    }
}
