$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    let level = parseInt(urlParams.get('level'));

    if (level) {
        $('#level-title').text(`Level ${level}`);
        const storyPath = `stories/level${level}.json`;

        $.getJSON(storyPath, function (data) {
            // asignar el texto de la historia
            $('#story-content').html(data.story.split('\n').map(para => `<p>${para}</p>`).join(''));


            // vocabulario
            data.vocabulary.forEach(item => {
                $('#vocabulary-list').append(
                    `<li class="list-group-item">${item.word} - ${item.meaning}</li>`
                );
            });

            // preguntas 
            data.questions.forEach((q, index) => {
                let optionsHtml = '';
                q.options.forEach(option => {
                    optionsHtml += `<li class="list-group-item option" data-answer="${option}" data-correct="${q.correct_answer}">
                                        ${option}
                                    </li>`;
                });

                $('#questions-list').append(`
                    <li class="list-group-item">
                        <strong>${q.question}</strong>
                        <ul class="list-group mt-2" id="question-${index}">
                            ${optionsHtml}
                        </ul>
                    </li>
                `);
            });

            // seleccionar una opción
            $('.option').on('click', function () {
                const selectedAnswer = $(this).data('answer');
                const correctAnswer = $(this).data('correct');

                if (selectedAnswer === correctAnswer) {
                    $(this).attr('data-answer', 'true'); // correcto
                } else {
                    $(this).attr('data-answer', 'false'); // incorrecto
                }

                // desactiva el clic en todas las opciones para evitar cambios adicionales
                $(this).siblings().off('click').css('opacity', '0.6');
                $(this).off('click');
            });

            // Botón "Previous" deshabilitado en el primer nivel
            if (level === 1) {
                $('#prev-btn').prop('disabled', true).addClass('disabled-btn');
            } else {
                $('#prev-btn').attr('href', `level.html?level=${level - 1}`).prop('disabled', false).removeClass('disabled-btn');
            }

            // Botón "Next" deshabilitado en el último nivel
            if (level === 10) {
                $('#next-btn').prop('disabled', true).addClass('disabled-btn').removeAttr('href');
            } else {
                $('#next-btn').attr('href', `level.html?level=${level + 1}`).prop('disabled', false).removeClass('disabled-btn');
            }

        }).fail(function () {
            $('#story-content').text("Content not found for this level.");
        });
    }
});
