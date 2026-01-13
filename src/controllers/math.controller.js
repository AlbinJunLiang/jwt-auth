

export const sumar = async (req, res) => {
    try {
        const { num1, num2 } = req.body;
        if (!num1 && !num2) {
            return res.status(400).json({
                message: 'Debe ingresar ambos números',
            });
        }

        return res.json({
            resultado: num1 + num2,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error interno',
        });
    }
};
