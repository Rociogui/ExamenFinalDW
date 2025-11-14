@echo off
cd /d "c:\Users\Rocío López\Desktop\ExamenFinalDesarrollo\componente-b"
echo Iniciando Componente B en puerto 8081...
echo.
mvnw.cmd spring-boot:run -Dspring-boot.run.jvmArguments="-Dserver.port=8081"
pause
